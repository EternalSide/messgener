import {db} from "@/lib/db";

export const getOrCreateConversation = async (
	memberOneId: string,
	memberTwoId: string
) => {
	let conversation =
		(await findConversation(memberOneId, memberTwoId)) ||
		(await findConversation(memberTwoId, memberOneId));

	if (!conversation) {
		conversation = await createNewConversation(memberOneId, memberTwoId);
	}

	return conversation;
};

const findConversation = async (memberOneId: string, memberTwoId: string) => {
	try {
		return await db.conversation.findFirst({
			where: {
				AND: [{userOneId: memberOneId}, {userTwoId: memberTwoId}],
			},
			include: {
				userOne: true,
				userTwo: true,
			},
		});
	} catch {
		return null;
	}
};

const createNewConversation = async (userOneId: string, userTwoId: string) => {
	try {
		return await db.conversation.create({
			data: {
				userOneId,
				userTwoId,
			},
			include: {
				userOne: true,
				userTwo: true,
			},
		});
	} catch (e) {
		console.log(e);
		return null;
	}
};
