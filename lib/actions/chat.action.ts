"use server";
import {getCurrentUser} from "./user.action";
import {db} from "../db";
import {DirectMessage} from "@prisma/client";
import {MESSAGES_COUNT_FOR_LOAD} from "@/constants";

export const getUserChats = async () => {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			throw new Error("Вы не авторизованы.");
		}

		const chats = await db.user.findUnique({
			where: {
				id: currentUser?.id!,
			},
			include: {
				channels: true,
				chatsInitiated: {
					include: {
						userOne: true,
						userTwo: true,
						directMessages: {
							select: {
								content: true,
								createdAt: true,
								id: true,
							},
						},
					},
					take: 6,
				},
				chatsReceived: {
					include: {
						userOne: true,
						userTwo: true,
						directMessages: {
							select: {
								content: true,
								createdAt: true,
								id: true,
							},
						},
					},
					take: 6,
				},
			},
		});

		let uniqueChats = [];

		const isUserHasChats =
			chats?.chatsInitiated || chats?.chatsReceived || chats?.channels;

		const defineLastTime = (chat: any) => {
			let lastMessageTime;
			const isChannel = !!chat?.creatorId;
			if (isChannel) {
				lastMessageTime = chat.createdAt;
			} else {
				lastMessageTime =
					chat?.directMessages.length > 0
						? chat.directMessages[chat.directMessages.length - 1].createdAt
						: "";
			}
			return lastMessageTime;
		};

		if (isUserHasChats) {
			const seenIds = new Set();
			for (const chat of [
				...chats?.chatsInitiated,
				...chats?.chatsReceived,
				...chats?.channels,
			]) {
				if (!seenIds.has(chat.id)) {
					seenIds.add(chat.id);
					uniqueChats.push({
						...chat,
						lastMessageTime: defineLastTime(chat),
					});
				}
			}
		}

		return uniqueChats?.sort((a: any, b: any) => {
			return (
				new Date(b.lastMessageTime).getTime() -
				new Date(a.lastMessageTime).getTime()
			);
		});
	} catch (e) {
		throw e;
	}
};

export const createNewChat = async (userOneId: string, userTwoId: string) => {
	try {
		return await db.chat.create({
			data: {
				userOneId,
				userTwoId,
			},
		});
	} catch (e) {
		console.log(e);
		return null;
	}
};

export const getChat = async (userOneId: string, userTwoId: string) => {
	let chat =
		(await _findChat(userOneId, userTwoId)) ||
		(await _findChat(userTwoId, userOneId));

	if (!chat) {
		chat = null;
	}

	return chat;
};

export const getMessages = async (params: any) => {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			throw new Error("Вы не авторизованы.");
		}

		const {cursor, chatId} = params;

		let messages: DirectMessage[] = [];

		if (cursor) {
			messages = await db.directMessage.findMany({
				take: MESSAGES_COUNT_FOR_LOAD,
				skip: 1,
				cursor: {
					id: cursor,
				},
				where: {
					chatId,
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
					chatId,
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

const _findChat = async (userOneId: string, userTwoId: string) => {
	try {
		return await db.chat.findFirst({
			where: {
				AND: [{userOneId}, {userTwoId}],
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
