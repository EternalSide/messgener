"use client";
import LeftSidebarSearch from "./LeftSidebarSearch";
import LeftSidebarMenu from "./LeftSidebarMenu";
import LeftSidebarContent from "./LeftSidebarContent";
import {useState} from "react";
import {ConversationWithUsersAndMessages, SideBarVariant} from "@/types";
import {User} from "@prisma/client";
import {getAllUsers, getCurrentUser} from "@/lib/actions/user.action";
import {getUserConversations} from "@/lib/actions/conversation.action";
import {useQueries} from "@tanstack/react-query";
import {cn, sortChats} from "@/lib/utils";
import Loader from "@/components/shared/Loader";

interface Props {
	mainPage?: boolean;
}

const LeftSidebar = ({mainPage}: Props) => {
	const [sidebarVariant, setSidebarVariant] = useState<SideBarVariant>("chats");

	const res: any = useQueries({
		queries: [
			{
				queryKey: ["currentUser"],
				queryFn: async () => await getCurrentUser(),
			},
			{
				queryKey: ["chats"],
				queryFn: async () => {
					const chats = await getUserConversations();
					const sortedChatsByLastMessage = sortChats(chats);
					return sortedChatsByLastMessage;
				},
			},
			{
				queryKey: ["users"],
				queryFn: async () => await getAllUsers(),
			},
		],
	});

	const currentUser = res[0].data as User;
	const chats = res[1].data as ConversationWithUsersAndMessages[];
	const users = res[2].data;

	const isLoading = () => {
		if (sidebarVariant === "chats") {
			return res[1].isLoading;
		}
		if (sidebarVariant === "users") {
			return res[2].isLoading;
		}
	};

	return (
		<div
			className={cn(
				" bg-light dark:bg-dark h-full fixed left-0 top-0 border-r shadow-md border-neutral-300 dark:border-neutral-700 px-0 py-1.5",
				mainPage ? "w-full" : "w-[390px]"
			)}
		>
			<div className='flex items-center gap-2.5 pr-4 pl-2.5'>
				<LeftSidebarMenu
					currentUser={currentUser}
					sidebarVariant={sidebarVariant}
					setSidebarVariant={setSidebarVariant}
				/>
				<LeftSidebarSearch
					sidebarVariant={sidebarVariant}
					currentUserId={currentUser?.id}
				/>
			</div>
			{isLoading() ? (
				<Loader />
			) : (
				<LeftSidebarContent
					currentUser={currentUser}
					sidebarVariant={sidebarVariant}
					chats={chats}
					users={users}
				/>
			)}
		</div>
	);
};
export default LeftSidebar;
