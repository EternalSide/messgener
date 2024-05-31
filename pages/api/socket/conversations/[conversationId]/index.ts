import {NextApiRequest} from "next";
import {NextApiResponseServerIo} from "@/types";

import {db} from "@/lib/db";
import {getCurrentUserForPages} from "@/lib/actions/user.action";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponseServerIo
) {
	if (req.method !== "DELETE")
		return res.status(405).json({error: "Method not allowed"});

	try {
		const profile = await getCurrentUserForPages(req);

		const {conversationId} = req.query;

		if (!profile) {
			return res.status(401).json({error: "Unauthorized"});
		}

		if (!conversationId) {
			return res.status(400).json({error: "Conversation ID missing"});
		}

		const existingConversation = await db.conversation.findUnique({
			where: {
				id: conversationId as string,
			},
			include: {
				userOne: true,
				userTwo: true,
			},
		});

		if (!existingConversation)
			return res.status(400).json({error: "Conversation ID missing"});

		const deletedConversation = await db.conversation.deleteMany({
			where: {
				id: conversationId as string,
				userOneId: existingConversation.userOneId,
				userTwoId: existingConversation.userTwoId,
			},
		});

		const channelKey = `chat:${conversationId}:messages:delete`;

		res?.socket?.server?.io?.emit(channelKey);

		return res.status(200).json(deletedConversation);
	} catch (error) {
		console.log("[DELETE_MESSAGES_POST]", error);
		return res.status(500).json({message: "Ошибка на стороне сервера"});
	}
}
