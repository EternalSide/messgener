import LeftSidebarSearch from "./LeftSidebarSearch";
import ChatCard from "@/components/chat/ChatCard";
import {ScrollArea} from "@/components/ui/scroll-area";
import LeftSidebarMenu from "./LeftSidebarMenu";
import {createProfile} from "@/lib/create-profile";
import LeftSidebarContent from "./LeftSidebarContent";

const LeftSidebar = async () => {
	const currentUser = await createProfile();

	return (
		<div className='w-[390px] bg-[#212121] h-full fixed left-0 top-0 border-r border-neutral-700 px-0 py-1.5'>
			<div className='flex items-center gap-2.5 pr-4 pl-2.5'>
				<LeftSidebarMenu username={currentUser.id} />
				<LeftSidebarSearch />
			</div>
			<LeftSidebarContent currentUser={currentUser} />
		</div>
	);
};
export default LeftSidebar;
