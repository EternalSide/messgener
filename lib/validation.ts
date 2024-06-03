import {z} from "zod";

export const messageSchema = z.object({
	content: z.string().min(1),
});

export const editProfileSchema = z.object({
	name: z.string().min(2, {
		message: "Имя не может быть меньше 2 символов.",
	}),
	username: z.string().min(5, {
		message: "Имя пользователя не может быть меньше 5 символов.",
	}),
});

export const createChannelSchema = z.object({
	name: z.string().min(2, {
		message: "Название канала не может быть меньше 2 символов.",
	}),
	description: z.string().min(1),
});
