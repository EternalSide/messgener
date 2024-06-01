import ChatEmpty from "@/components/chat/ChatWelcome";
import {NO_CHAT_SELECTED_IMAGE} from "@/constants";
import LeftSidebar from "../../../components/shared/Sidebar/LeftSidebar";

export default function Home() {
	return (
		<main className='h-full'>
			<div className='max-lg:hidden flex justify-center items-center h-full'>
				<ChatEmpty
					src={NO_CHAT_SELECTED_IMAGE}
					h1='Чат не выбран...'
					h3='Выберите чат или начните новый.'
				/>
			</div>
			<div className='lg:hidden'>
				<LeftSidebar mainPage={true} />
			</div>
		</main>
	);
}
