"use server";
import {auth, currentUser, getAuth} from "@clerk/nextjs/server";
import {db} from "../db";
import {redirect} from "next/navigation";
import {NextApiRequest} from "next";

export const getAllUsers = async () => {
	const users = await db.user.findMany({
		take: 10,
		orderBy: {
			createdAt: "asc",
		},
	});

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
	// // * upload fake data
	// createFakeUsers(profile.id);

	if (profile) return profile;

	const newProfile = await db.user.create({
		data: {
			userId: user?.id,
			name: `${user.firstName}`,
			profilePic: user?.imageUrl,
			email: user.emailAddresses[0].emailAddress,
			username: user.username as string,
		},
	});

	// Избранное
	const chat = await db.chat.create({
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
			chatId: chat.id,
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

export const updateUser = async (props: {
	name: string;
	username: string;
	userId: string;
	profilePic: string;
	backgroundPic: string;
}) => {
	try {
		const currentUser = await getCurrentUser();

		const {name, username, userId, profilePic, backgroundPic} = props;

		if (!currentUser || currentUser.id !== userId) {
			throw new Error("Данные не совпадают");
		}

		const user = await db.user.update({
			where: {
				id: currentUser.id,
			},
			data: {
				name,
				username,
				profilePic,
				backgroundPic,
			},
		});
		return user;
	} catch (e: any) {
		if (e.code === "P2002") {
			return {message: "Имя пользователя занято."};
		}
		throw new Error(e);
	}
};

export const findUsers = async (params: {searchQuery: string}) => {
	try {
		const {searchQuery} = params;

		const users = await db.user.findMany({
			where: {
				OR: [
					{username: {contains: searchQuery, mode: "insensitive"}},
					{name: {contains: searchQuery, mode: "insensitive"}},
				],
			},
		});

		if (!users) return [];

		return users;
	} catch (e) {
		console.log(e);
		throw e;
	}
};
