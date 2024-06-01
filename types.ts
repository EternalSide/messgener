import {Server as NetServer, Socket} from "net";
import {Server as SocketIOServer} from "socket.io";
import {NextApiResponse} from "next";
import {Prisma} from "@prisma/client";

export type NextApiResponseServerIo = NextApiResponse & {
	socket: Socket & {
		server: NetServer & {
			io: SocketIOServer;
		};
	};
};
export type SideBarVariant = "chats" | "users";

export type ConversationWithUsersAndMessages = Prisma.ConversationGetPayload<{
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
