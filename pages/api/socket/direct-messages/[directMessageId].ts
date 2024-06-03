import {NextApiRequest} from "next";
import {NextApiResponseServerIo} from "@/types";
import {db} from "@/lib/db";
import {getCurrentUserForPages} from "@/lib/actions/user.action";
import {getSocketKeys} from "@/lib/utils";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponseServerIo
) {
	if (req.method !== "DELETE" && req.method !== "PATCH") {
		return res.status(405).json({error: "Method не разрешен"});
	}

	try {
		const currentUser = await getCurrentUserForPages(req);
		let directMessageId;
		let chatId;
		let content;

		if (req.method === "DELETE") {
			directMessageId = req.body.directMessageId;
			chatId = req.body.chatId;
		}
		if (req.method === "PATCH") {
			directMessageId = req.body.data.directMessageId;
			chatId = req.body.data.chatId;
			content = req.body.values.content;
		}

		if (!currentUser) {
			return res.status(401).json({error: "Вы не авторизованы."});
		}

		if (!chatId) {
			return res.status(400).json({error: "Не указан Chat Id"});
		}

		const chat = await db.chat.findFirst({
			where: {
				id: chatId as string,
				OR: [
					{
						userOneId: currentUser.id,
					},
					{
						userTwoId: currentUser.id,
					},
				],
			},
			include: {
				userOne: true,
				userTwo: true,
				directMessages: true,
			},
		});

		if (!chat) {
			return res.status(404).json({error: "Чат не найден."});
		}

		const isUserHasThisConversation =
			chat.userOne.id === currentUser.id ? chat.userOne : chat.userTwo;

		if (!isUserHasThisConversation)
			return res.status(404).json({error: "Чат не найден."});

		let message = await db.directMessage.findFirst({
			where: {
				id: directMessageId,
				chatId,
			},
			include: {
				user: true,
			},
		});

		if (!message) {
			return res.status(404).json({error: "Сообщение не найдено"});
		}

		const isMessageOwner = message.userId === isUserHasThisConversation.id;

		const canModify = isMessageOwner;

		if (!canModify) return res.status(401).json({error: "Вы не авторизованы."});

		if (req.method === "DELETE") {
			await db.directMessage.delete({
				where: {
					id: directMessageId,
					chatId,
				},
			});
		}

		if (req.method === "PATCH") {
			if (!isMessageOwner)
				return res.status(401).json({error: "Вы не авторизованы."});

			message = await db.directMessage.update({
				where: {
					id: directMessageId,
				},
				data: {
					content,
				},
				include: {
					user: true,
				},
			});
		}

		const {updateMessageKey} = getSocketKeys(chat.id);

		res?.socket?.server?.io?.emit(updateMessageKey, {chat, message});

		return res.status(200).json(message);
	} catch (error) {
		console.log("[MESSAGE_ID]", error);
		return res.status(500).json({error: "Ошибка на стороне сервера"});
	}
}
