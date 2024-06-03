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
	return chats?.sort((a: any, b: any) => {
		if (!a?.directMessages || !b?.directMessages) return [];
		const lastMessagea = a.directMessages[a.directMessages.length - 1];
		const lastMessageb = b.directMessages[b.directMessages.length - 1];
		if (!lastMessagea || !lastMessageb) return [];

		return (
			new Date(lastMessageb.createdAt).getTime() -
			new Date(lastMessagea.createdAt).getTime()
		);
	});
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
