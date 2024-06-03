import ChatHeader from "@/components/chat/ChatHeader";
import {ChatInput} from "@/components/chat/ChatInput";
import {getCurrentUser, getOtherUser} from "@/lib/actions/user.action";
import {getChat} from "@/lib/actions/chat.action";
import {redirect} from "next/navigation";
import ChatMessages from "@/components/chat/ChatMessages";
import {Metadata} from "next";

interface Props {
	params: {
		userId: string;
	};
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
	const otherUser = await getOtherUser(params.userId);

	return {
		title: otherUser?.name || "Chatgram",
	};
}

const ChatWithUser = async ({params}: Props) => {
	const currentUser = await getCurrentUser();
	if (!currentUser) return redirect("/sign-in");
	// С кем начали чат
	const otherUser = await getOtherUser(params.userId);

	// Заглушка если начинаем чат, с несуществующим пользователем.
	if (!otherUser) return redirect("/");

	const chat = await getChat(currentUser.id, otherUser.id);

	const userId = currentUser?.username || currentUser.id;
	const isOwnChat = params.userId === userId;

	return (
		<div className='flex flex-col h-full'>
			<ChatHeader
				title={isOwnChat ? "Избранное" : otherUser.name}
				picture={otherUser?.profilePic}
				chatId={chat ? chat.id : null}
				isOwnChat={isOwnChat}
				type='chat'
			/>
			<div className='max-w-[700px] w-full mx-auto max-[1200px]:px-4 flex-1 flex flex-col overflow-y-auto '>
				<ChatMessages
					chatId={chat ? chat.id : null}
					currentUser={currentUser}
					otherUserId={otherUser.id}
				/>

				<ChatInput
					chat={{
						users: [currentUser, otherUser],
						chatId: chat ? chat.id : null,
					}}
					variant='chat'
				/>
			</div>
		</div>
	);
};
export default ChatWithUser;
