"use server";
import {currentUser} from "@clerk/nextjs/server";
import {db} from "./db";
import {redirect} from "next/navigation";

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
			username: user.username,
		},
	});

	return newProfile;
};
