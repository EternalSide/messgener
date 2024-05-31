"use server";

import {getCurrentUser} from "./user.action";
import {db} from "../db";
import {DirectMessage} from "@prisma/client";
import {MESSAGES_COUNT_FOR_LOAD} from "@/constants";

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

export const getMessages = async (props: any) => {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			throw new Error("unauthorized");
		}

		const {cursor, conversationId} = props;

		let messages: DirectMessage[] = [];

		if (cursor) {
			messages = await db.directMessage.findMany({
				take: MESSAGES_COUNT_FOR_LOAD,
				skip: 1,
				cursor: {
					id: cursor,
				},
				where: {
					conversationId,
				},
				include: {
					user: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			});
		} else {
			messages = await db.directMessage.findMany({
				take: MESSAGES_COUNT_FOR_LOAD,
				where: {
					conversationId,
				},
				include: {
					user: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			});
		}

		let nextCursor = null;

		if (messages.length === MESSAGES_COUNT_FOR_LOAD) {
			nextCursor = messages[MESSAGES_COUNT_FOR_LOAD - 1].id;
		}

		return {
			items: messages,
			nextCursor,
		};
	} catch (e) {
		console.log(e);
		throw e;
	}
};
