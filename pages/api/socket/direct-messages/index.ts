import {NextApiRequest} from "next";
import {NextApiResponseServerIo} from "@/types";

import {db} from "@/lib/db";
import {getCurrentUserForPages} from "@/lib/actions/user.action";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponseServerIo
) {
	if (req.method !== "POST")
		return res.status(405).json({error: "Method not allowed"});

	try {
		const profile = await getCurrentUserForPages(req);

		const {content} = req.body;
		const {conversationId} = req.query;

		if (!profile) {
			return res.status(401).json({error: "Unauthorized"});
		}

		if (!conversationId) {
			return res.status(400).json({error: "Conversation ID missing"});
		}

		if (!content) {
			return res.status(400).json({error: "Content missing"});
		}

		const conversation = await db.conversation.findFirst({
			where: {
				id: conversationId as string,
				OR: [
					{
						userOne: {
							id: profile.id as string,
						},
					},
					{
						userTwo: {
							id: profile.id as string,
						},
					},
				],
			},
			include: {
				userOne: true,
				directMessages: true,
				userTwo: true,
			},
		});

		if (!conversation) {
			return res.status(404).json({message: "Conversation not found"});
		}

		const member =
			conversation.userOne.id === profile.id
				? conversation.userOne
				: conversation.userTwo;

		if (!member) {
			return res.status(404).json({message: "Member not found"});
		}

		const message = await db.directMessage.create({
			data: {
				content,
				conversationId: conversationId as string,
				userId: member.id,
			},
			include: {
				user: true,
			},
		});

		const channelKey = `chat:${conversationId}:messages`;

		res?.socket?.server?.io?.emit(channelKey, message);

		return res.status(200).json({conversation, message});
	} catch (error) {
		console.log("[DIRECT_MESSAGES_POST]", error);
		return res.status(500).json({message: "Internal Error"});
	}
}
