import {getAllUsers} from "@/lib/actions/user.action";
import {SideBarVariant} from "@/types";
import {User} from "@prisma/client";
import {useEffect, useState} from "react";

const useSidebar = (state: SideBarVariant) => {
	const [users, setUsers] = useState<User[] | []>([]);

	useEffect(() => {
		const getUsers = async () => {
			const allUsers = await getAllUsers();
			setUsers(allUsers);
		};

		if (state === "users") {
			getUsers();
		}
	}, [state]);

	return users;
};
export default useSidebar;
