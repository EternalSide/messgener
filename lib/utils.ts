import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import {faker} from "@faker-js/faker";
import {db} from "./db";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getSocketKeys(chatId: string | null) {
	const queryKey = `chat:${chatId}`;
	const addKey = `chat:${chatId}:messages`;
	const updateKey = `chat:${chatId}:messages:update`;
	const deleteKey = `chat:${chatId}:messages:delete`;

	return {
		queryKey,
		addKey,
		updateKey,
		deleteKey,
	};
}

export function formatDate(inputDateStr: any): string {
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
		if (!a?.directMessages || !b?.directMessages) return b - a;
		const lastMessagea = a.directMessages[a.directMessages.length - 1];
		const lastMessageb = b.directMessages[b.directMessages.length - 1];
		if (!lastMessagea || !lastMessageb) return [];
		const at = lastMessagea.createdAt;
		const bt = lastMessageb.createdAt;
		return new Date(bt).getTime() - new Date(at).getTime();
	});
}

export const createFakeUsers = async (currentUserId: string) => {
	const USER_COUNT = 15;
	for (let i = 0; i < USER_COUNT; i++) {
		const user = await db.user.create({
			data: {
				userId: faker.database.mongodbObjectId(),
				name: faker.internet.displayName(),
				imageUrl: faker.image.avatar(),
				email: faker.internet.email(),
				username: faker.internet.userName(),
				chatBackground: "/bg.jpg",
			},
		});
		// Избранное
		const conversation = await db.conversation.create({
			data: {
				userOneId: user.id,
				userTwoId: user.id,
			},
		});
		const c = await db.conversation.create({
			data: {
				userOneId: currentUserId,
				userTwoId: user.id,
			},
		});
		await db.directMessage.create({
			data: {
				content: "Hi World!",
				conversationId: c.id,
				userId: currentUserId,
			},
		});
		await db.directMessage.create({
			data: {
				content: "Hi World!",
				conversationId: conversation.id,
				userId: user.id,
			},
		});
	}
};
