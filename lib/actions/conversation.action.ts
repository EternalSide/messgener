"use server";

import {getCurrentUser} from "./user.action";
import {db} from "../db";

export const getUserConversations = async () => {
	try {
		const currentUser = await getCurrentUser();
		const chats = await db.user.findUnique({
			where: {
				id: currentUser?.id!,
			},
			include: {
				conversationsInitiated: {
					include: {
						userTwo: true,
						directMessages: {
							select: {
								content: true,
								createdAt: true,
							},
						},
					},
				},
				conversationsReceived: {
					include: {
						userTwo: true,
						directMessages: {
							select: {
								content: true,
								createdAt: true,
							},
						},
					},
				},
			},
		});

		let allChats: any;

		if (
			chats?.conversationsInitiated.length ||
			chats?.conversationsReceived.length
		) {
			const c = [
				...chats?.conversationsInitiated,
				...chats?.conversationsReceived,
			];
			const uniqueChats = [];
			const seenIds = new Set();

			for (const chat of c) {
				if (!seenIds.has(chat.id)) {
					seenIds.add(chat.id);
					uniqueChats.push(chat);
				}
			}
			allChats = uniqueChats;
		} else {
			allChats = [];
		}

		return allChats;
	} catch (e) {
		throw e;
	}
};

export const createNewConversation = async (
	userOneId: string,
	userTwoId: string
) => {
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
export const getConversation = async (
	memberOneId: string,
	memberTwoId: string
) => {
	let conversation =
		(await _findConversation(memberOneId, memberTwoId)) ||
		(await _findConversation(memberTwoId, memberOneId));

	if (!conversation) {
		conversation = null;
	}

	return conversation;
};

const _findConversation = async (memberOneId: string, memberTwoId: string) => {
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
