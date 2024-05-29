import LeftSidebarSearch from "./LeftSidebarSearch";
import ChatCard from "@/components/chat/ChatCard";
import {ScrollArea} from "@/components/ui/scroll-area";
import LeftSidebarMenu from "./LeftSidebarMenu";

const LeftSidebar = () => {
	return (
		<div className='w-[390px] bg-[#212121] h-full fixed left-0 top-0 border-r border-neutral-700 px-0 py-1.5'>
			<div className='flex items-center gap-2.5 pr-4 pl-2.5'>
				<LeftSidebarMenu />
				<LeftSidebarSearch />
			</div>
			<ScrollArea className='mt-2 px-2.5 flex flex-col h-full border-none'>
				{[0, 1, 2, 3, 4, 5].map((item: any) => (
					<ChatCard key={item} />
				))}
			</ScrollArea>
			a
		</div>
	);
};
export default LeftSidebar;
