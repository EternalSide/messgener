"use server";
import {db} from "../db";
import {getCurrentUser} from "./user.action";

export const createChannel = async (data: {
	name: string;
	description: string;
	picture: string;
	type: string;
	link: string;
}) => {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			throw new Error("not authorized");
		}

		const newChannel = await db.channel.create({
			data: {
				creatorId: currentUser.id,
				...data,
			},
		});

		return newChannel;
	} catch (e) {
		console.log(e);
		throw e;
	}
};
