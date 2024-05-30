"use client";
import LeftSidebarSearch from "./LeftSidebarSearch";
import LeftSidebarMenu from "./LeftSidebarMenu";
import LeftSidebarContent from "./LeftSidebarContent";
import {useEffect, useState} from "react";
import {SideBarVariant} from "@/types";
import {User} from "@prisma/client";
import {getCurrentUser} from "@/lib/actions/user.action";
import {getUserConversations} from "@/lib/actions/conversation.action";
import {useQuery} from "@tanstack/react-query";

// remake to async/await
const LeftSidebar = () => {
	const [state, setState] = useState<SideBarVariant>("chats");
	const [currentUser, setCurrentUser] = useState<User | null>(null);

	const {data, isLoading} = useQuery({
		queryKey: ["chats"],
		queryFn: async () => await getUserConversations(),
	});

	useEffect(() => {
		const fetchUser = async () => {
			const user = await getCurrentUser();
			setCurrentUser(user);
		};
		fetchUser();
	}, []);

	const chats = data?.sort((a: any, b: any) => {
		const lastMessagea = a.directMessages[a.directMessages.length - 1];
		const lastMessageb = b.directMessages[b.directMessages.length - 1];
		if (!lastMessagea || !lastMessageb) return [];
		const at = lastMessagea.createdAt;
		const bt = lastMessageb.createdAt;
		return new Date(bt).getTime() - new Date(at).getTime();
	});

	return (
		<div className='w-[390px] bg-white dark:bg-[#212121] h-full fixed left-0 top-0 border-r border-neutral-300 dark:border-neutral-700 px-0 py-1.5'>
			<div className='flex items-center gap-2.5 pr-4 pl-2.5'>
				<LeftSidebarMenu
					currentUser={currentUser as User}
					state={state}
					setState={setState}
				/>
				<LeftSidebarSearch />
			</div>
			{isLoading ? (
				<p>Loading...</p>
			) : (
				<LeftSidebarContent
					currentUser={currentUser as User}
					state={state}
					chats={chats}
				/>
			)}
		</div>
	);
};
export default LeftSidebar;
