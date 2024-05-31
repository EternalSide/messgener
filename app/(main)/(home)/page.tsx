import ChatEmpty from "@/components/chat-empty";
import {NO_CHAT_SELECTED_IMAGE} from "@/constants";

export default function Home() {
	return (
		<main className='h-full'>
			<ChatEmpty
				src={NO_CHAT_SELECTED_IMAGE}
				h1='Чат не выбран...'
				h3='Выберите чат или начните новый.'
			/>
		</main>
	);
}
