import {SidebarCardType} from "@/types";
import {User} from "@prisma/client";
import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getSocketKeys(chatId: string | null) {
	const queryKey = `chat:${chatId}`;
	const sendMessageKey = `chat:${chatId}:messages:send-message`;
	const updateMessageKey = `chat:${chatId}:messages:update-message`;
	const deleteMessageKey = `chat:${chatId}:messages:delete-message`;
	const deleteChatKey = `chat:${chatId}:delete-chat`;

	return {
		queryKey,
		sendMessageKey,
		updateMessageKey,
		deleteMessageKey,
		deleteChatKey,
	};
}

export function formatDate(inputDateStr: Date): string {
	const inputDate = new Date(inputDateStr);

	// Определение локального времени
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const yesterday = new Date(today);
	yesterday.setDate(today.getDate() - 1);

	// Форматирование времени
	const options: Intl.DateTimeFormatOptions = {
		hour: "2-digit",
		minute: "2-digit",
	};

	if (inputDate >= today) {
		return inputDate.toLocaleTimeString("ru-RU", options);
	} else if (inputDate >= yesterday) {
		return `Вчера ${inputDate.toLocaleTimeString("ru-RU", options)}`;
	} else {
		const dateOptions: Intl.DateTimeFormatOptions = {
			day: "2-digit",
			month: "short",
		};
		return `${inputDate.toLocaleDateString(
			"ru-RU",
			dateOptions
		)} ${inputDate.toLocaleTimeString("ru-RU", options)}`;
	}
}

export function sortChats(chats: any) {
	const c = chats?.sort((a: any, b: any) => {
		const isChannel = !!a?.creatorId;

		if (!isChannel) {
			if (!a?.directMessages || !b?.directMessages) return [];
			const lastMessagea = a.directMessages[a.directMessages.length - 1];
			const lastMessageb = b.directMessages[b.directMessages.length - 1];
			if (!lastMessagea || !lastMessageb) return [];

			return (
				new Date(lastMessageb.createdAt).getTime() -
				new Date(lastMessagea.createdAt).getTime()
			);
		}
	});

	return c;
}

export function generateChatData(chat: any, currentUser: User) {
	const isChannel = !!chat?.link;
	const isChat = !!chat?.userOne;
	let otherUser;
	let isSavedChat;
	let lastMessage;
	let picture;
	let link;
	let title;
	let lastMessageTime;
	let variant: SidebarCardType = "channel";

	switch (isChannel || isChat) {
		case isChannel:
			link = chat.link;
			title = chat.name;
			picture = chat.picture;
			lastMessage = chat?.posts?.length > 0 ? "пост месага" : "Канал создан.";
			lastMessageTime =
				chat?.posts?.length > 0
					? "дата публикации ласт поста"
					: formatDate(chat.createdAt);
			variant = "channel";
			break;

		case isChat:
			otherUser =
				chat.userOne.id === currentUser.id ? chat.userTwo : chat.userOne;
			isSavedChat = otherUser.name === currentUser?.name;
			title = isSavedChat ? "Избранное" : otherUser.name;
			picture = isSavedChat ? currentUser?.profilePic : otherUser.profilePic;
			link = otherUser.username;
			const lastM = chat?.directMessages[chat?.directMessages?.length - 1];
			lastMessage = lastM.content;
			lastMessageTime = lastM?.createdAt ? formatDate(lastM.createdAt) : null;
			variant = "chat";
			break;
		default:
			break;
	}

	return {
		otherUser,
		isSavedChat,
		lastMessage,
		picture,
		link,
		title,
		lastMessageTime,
		variant,
	};
}

// export const createFakeUsers = async (currentUserId: string) => {
// 	const USER_COUNT = 15;
// 	for (let i = 0; i < USER_COUNT; i++) {
// 		const user = await db.user.create({
// 			data: {
// 				userId: faker.database.mongodbObjectId(),
// 				name: faker.internet.displayName(),
// 				profilePic: faker.image.avatar(),
// 				email: faker.internet.email(),
// 				username: faker.internet.userName(),
// 			},
// 		});
// 		// Избранное
// 		const chat = await db.chat.create({
// 			data: {
// 				userOneId: user.id,
// 				userTwoId: user.id,
// 			},
// 		});
// 		const c = await db.chat.create({
// 			data: {
// 				userOneId: currentUserId,
// 				userTwoId: user.id,
// 			},
// 		});
// 		await db.directMessage.create({
// 			data: {
// 				content: "Hi World!",
// 				chatId: c.id,
// 				userId: currentUserId,
// 			},
// 		});
// 		await db.directMessage.create({
// 			data: {
// 				content: "Hi World!",
// 				chatId: chat.id,
// 				userId: user.id,
// 			},
// 		});
// 	}
// };
