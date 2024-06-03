import {Server as NetServer, Socket} from "net";
import {Server as SocketIOServer} from "socket.io";
import {NextApiResponse} from "next";
import {Chat, DirectMessage, Prisma} from "@prisma/client";

export type NextApiResponseServerIo = NextApiResponse & {
	socket: Socket & {
		server: NetServer & {
			io: SocketIOServer;
		};
	};
};
export type SideBarVariant = "chats" | "users";

export type ChatWithUsersAndMessages = Prisma.ChatGetPayload<{
	include: {
		userOne: true;
		userTwo: true;
		directMessages: {
			select: {
				content: true;
				createdAt: true;
			};
		};
	};
}>;

export type SendMessageDataType = {
	isFirstMessage: boolean;
	conversation: null | Chat;
};

export interface SendMessageToTheUser {
	chatId: string | null | undefined;
	content: string;
	userOneId: string;
	userTwoId: string;
}
export interface SocketRes {
	chat: ChatWithUsersAndMessages;
	message: DirectMessage;
}
