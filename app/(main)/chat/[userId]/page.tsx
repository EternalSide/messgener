import ChatHeader from "@/components/chat/ChatHeader";
import {ChatInput} from "@/components/chat/ChatInput";
import {getCurrentUser, getOtherUser} from "@/lib/actions/user.action";
import {getConversation} from "@/lib/actions/conversation.action";
import {redirect} from "next/navigation";
import ChatMessages from "@/components/chat/ChatMessages";

const ChatWithUser = async ({params}: {params: {userId: string}}) => {
	const currentUser = await getCurrentUser();
	if (!currentUser) return redirect("/sign-in");
	// С кем начали чат
	const user = await getOtherUser(params.userId);

	// Заглушка если начинаем чат, с несуществующим пользователем.
	if (!user) return redirect("/");

	const conversation = await getConversation(currentUser.id, user.id);

	// User может не иметь username, тогда сравниваем по id
	const userId = currentUser?.username || currentUser.id;
	const isOwnChat = params.userId === userId;

	return (
		<div className='flex flex-col h-full'>
			<ChatHeader
				authorName={isOwnChat ? "Избранное" : user.name}
				authorPic={user?.imageUrl}
				variant={isOwnChat ? "savedMessaged" : "chat"}
				conversationId={conversation ? conversation.id : null}
				isOwnChat={isOwnChat}
			/>
			<div className='max-w-[700px] w-full mx-auto max-[1200px]:px-4 flex-1 flex flex-col overflow-y-auto '>
				<ChatMessages
					chatId={conversation ? conversation.id : null}
					currentUser={currentUser}
					otherUserId={user.id}
				/>

				<ChatInput
					users={[currentUser, user]}
					conversationId={conversation ? conversation.id : null}
				/>
			</div>
		</div>
	);
};
export default ChatWithUser;
