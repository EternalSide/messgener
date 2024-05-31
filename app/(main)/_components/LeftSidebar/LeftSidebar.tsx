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
import {Loader2} from "lucide-react";
import useSidebarMessages from "@/hooks/sidebar/useSidebarMessages";

const LeftSidebar = () => {
	const [state, setState] = useState<SideBarVariant>("chats");
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	useEffect(() => {
		const fetchUser = async () => {
			const user = await getCurrentUser();
			setCurrentUser(user);
		};
		fetchUser();
	}, []);

	const {data, isLoading} = useQuery({
		queryKey: ["chats"],
		queryFn: async () => {
			const chats = await getUserConversations();
			const c = chats?.sort((a: any, b: any) => {
				if (!a?.directMessages || !b?.directMessages) return b - a;
				const lastMessagea = a.directMessages[a.directMessages.length - 1];
				const lastMessageb = b.directMessages[b.directMessages.length - 1];
				if (!lastMessagea || !lastMessageb) return [];
				const at = lastMessagea.createdAt;
				const bt = lastMessageb.createdAt;
				return new Date(bt).getTime() - new Date(at).getTime();
			});
			return c;
		},
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
				<div className='flex flex-col flex-1 justify-center items-center'>
					<Loader2 className='h-7 w-7 text-primary animate-spin my-4' />
				</div>
			) : (
				<LeftSidebarContent
					currentUser={currentUser as User}
					state={state}
					chats={data}
				/>
			)}
		</div>
	);
};
export default LeftSidebar;
