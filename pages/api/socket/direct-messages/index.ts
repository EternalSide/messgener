import {NextApiRequest} from "next";
import {NextApiResponseServerIo} from "@/types";

import {db} from "@/lib/db";
import {getCurrentUserForPages} from "@/lib/actions/user.action";
import {getSocketKeys} from "@/lib/utils";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponseServerIo
) {
	if (req.method !== "POST")
		return res.status(405).json({error: "Метод не разрешен"});

	try {
		const currentUser = await getCurrentUserForPages(req);
		const {content} = req.body;
		const {chatId} = req.query;

		if (!currentUser) {
			return res.status(401).json({error: "Вы не авторизованы."});
		}

		if (!chatId) {
			return res.status(400).json({error: "Не указан Chat Id"});
		}

		if (!content) {
			return res.status(400).json({error: "Пустое сообщение."});
		}

		const chat = await db.chat.findFirst({
			where: {
				id: chatId as string,
				OR: [
					{
						userOne: {
							id: currentUser.id,
						},
					},
					{
						userTwo: {
							id: currentUser.id,
						},
					},
				],
			},
			include: {
				userOne: true,
				userTwo: true,
				directMessages: {
					orderBy: {
						createdAt: "asc",
					},
				},
			},
		});

		if (!chat) {
			return res.status(404).json({message: "Чат не найден."});
		}

		const isUserHasThisConversation =
			chat.userOne.id === currentUser.id ? chat.userOne : chat.userTwo;

		if (!isUserHasThisConversation)
			return res.status(404).json({message: "Чат не найден."});

		const message = await db.directMessage.create({
			data: {
				content,
				chatId: chatId as string,
				userId: isUserHasThisConversation.id,
			},
		});

		const {sendMessageKey} = getSocketKeys(chatId as string);

		res?.socket?.server?.io?.emit(sendMessageKey, {chat, message});

		return res.status(200).json({chat, message});
	} catch (error) {
		console.log("[DIRECT_MESSAGES_POST]", error);
		return res.status(500).json({message: "Ошибка на стороне сервера"});
	}
}
