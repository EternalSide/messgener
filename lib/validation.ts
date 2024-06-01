import {z} from "zod";

export const messageSchema = z.object({
	content: z.string().min(1),
});

export const editProfileSchema = z.object({
	name: z.string().min(2, {
		message: "name must be at least 2 characters.",
	}),
	username: z.string().min(5, {
		message: "username must be at least 5 characters.",
	}),
});
