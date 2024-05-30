"use server";

import {db} from "../db";

export const getAllUsers = async () => {
	const users = await db.user.findMany();

	return users;
};
