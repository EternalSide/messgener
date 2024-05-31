"use server";

import {auth, currentUser, getAuth} from "@clerk/nextjs/server";
import {db} from "../db";
import {redirect} from "next/navigation";
import {NextApiRequest} from "next";

export const getAllUsers = async () => {
	const users = await db.user.findMany();

	return users;
};

export const createProfile = async () => {
	const user = await currentUser();

	if (!user?.id) return redirect("/sign-in");

	const profile = await db.user.findUnique({
		where: {
			userId: user?.id,
		},
	});

	if (profile) return profile;

	const newProfile = await db.user.create({
		data: {
			userId: user?.id,
			name: `${user.firstName}`,
			imageUrl: user.imageUrl,
			email: user.emailAddresses[0].emailAddress,
			username: user.username as string,
			chatBackground: "/bg.jpg",
		},
	});

	// Избранное
	const conversation = await db.conversation.create({
		data: {
			userOneId: newProfile.id,
			userTwoId: newProfile.id,
		},
		include: {
			userOne: true,
			userTwo: true,
		},
	});

	await db.directMessage.create({
		data: {
			content: "Hi World!",
			conversationId: conversation.id,
			userId: newProfile.id,
		},
	});
	return newProfile;
};

export const getCurrentUser = async () => {
	const {userId} = auth();

	if (!userId) return null;

	const user = await db.user.findUnique({
		where: {
			userId,
		},
	});

	return user;
};

export const getCurrentUserForPages = async (req: NextApiRequest) => {
	const {userId} = getAuth(req);

	if (!userId) return null;

	const profile = await db.user.findUnique({
		where: {
			userId,
		},
	});

	return profile;
};

export const getOtherUser = async (userId: string) => {
	try {
		const otherUser = await db.user.findFirst({
			where: {
				OR: [{id: userId}, {username: userId}],
			},
		});
		return otherUser;
	} catch (e) {
		console.log(e);
	}
};

export const updateUser = async (props: any) => {
	try {
		const profile = await getCurrentUser();

		const {name, username, userId} = props;

		if (!profile || profile.id !== userId) {
			throw new Error("Данные не совпадают");
		}

		const user = await db.user.update({
			where: {
				id: profile.id,
			},
			data: {
				name,
				username,
			},
		});

		return user;
	} catch (e: any) {
		if (e.code === "P2002") {
			return {message: "Имя пользователя занято."};
		}
		return {message: e};
	}
};
