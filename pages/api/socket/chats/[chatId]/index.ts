import {NextApiRequest} from "next";
import {NextApiResponseServerIo} from "@/types";
import {db} from "@/lib/db";
import {getCurrentUserForPages} from "@/lib/actions/user.action";
import {getSocketKeys} from "@/lib/utils";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponseServerIo
) {
	if (req.method !== "DELETE")
		return res.status(405).json({error: "Method не разрешен"});

	try {
		const currentUser = await getCurrentUserForPages(req);

		const {chatId} = req.query;

		if (!currentUser)
			return res.status(401).json({error: "Вы не авторизованы."});

		if (!chatId) return res.status(400).json({error: "Не указан Chat Id"});

		const existingChat = await db.chat.findUnique({
			where: {
				id: chatId as string,
			},
		});

		if (!existingChat)
			return res.status(400).json({error: "Не указан Chat Id"});

		const isUserHasThisChat =
			existingChat.userOneId === currentUser.id ||
			existingChat.userTwoId === currentUser.id;

		if (!isUserHasThisChat)
			return res.status(401).json({error: "not ur chat))"});

		const deletedChat = await db.chat.deleteMany({
			where: {
				id: chatId as string,
				userOneId: existingChat.userOneId,
				userTwoId: existingChat.userTwoId,
			},
		});

		const {deleteChatKey} = getSocketKeys(chatId as string);

		res?.socket?.server?.io?.emit(deleteChatKey);

		return res.status(200).json(deletedChat);
	} catch (error) {
		console.log("[DELETE_MESSAGES_POST]", error);
		return res.status(500).json({message: "Ошибка на стороне сервера"});
	}
}
