"use client";
import LeftSidebarSearch from "./LeftSidebarSearch";
import LeftSidebarMenu from "./LeftSidebarMenu";
import LeftSidebarContent from "./LeftSidebarContent";
import {useState} from "react";
import {SideBarVariant} from "@/types";
import {User} from "@prisma/client";

interface Props {
	currentUser: User;
	chats: any;
}

const LeftSidebar = ({currentUser, chats}: Props) => {
	const [state, setState] = useState<SideBarVariant>("chats");

	return (
		<div className='w-[390px] bg-white dark:bg-[#212121] h-full fixed left-0 top-0 border-r border-neutral-300 dark:border-neutral-700 px-0 py-1.5'>
			<div className='flex items-center gap-2.5 pr-4 pl-2.5'>
				<LeftSidebarMenu
					currentUser={currentUser}
					state={state}
					setState={setState}
				/>
				<LeftSidebarSearch />
			</div>
			<LeftSidebarContent
				currentUser={currentUser}
				state={state}
				chats={chats}
			/>
		</div>
	);
};
export default LeftSidebar;
