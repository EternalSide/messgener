import ChatHeader from "@/components/chat/ChatHeader";
import {ChatInput} from "@/components/chat/ChatInput";
import {getCurrentUser} from "@/lib/actions/user.action";
import {db} from "@/lib/db";
import {getConversation} from "@/lib/actions/conversation.action";
import {redirect} from "next/navigation";

const ChatWithUser = async ({params}: {params: {userId: string}}) => {
	const currentUser = await getCurrentUser();
	if (!currentUser) return redirect("/sign-in");

	// С кем начали чат
	const user = await db.user.findFirst({
		where: {
			OR: [{id: params.userId}, {username: params.userId}],
		},
	});

	// Заглушка если начинаем чат, с несуществующим пользователем.
	if (!user) return redirect("/");

	const conversation = await getConversation(currentUser.id, user.id);

	// User может не иметь username, тогда сравниваем по id
	const userId = currentUser?.username || currentUser.id;
	const isOwnChat = params.userId === userId;

	const otherMember = currentUser.id === currentUser.id ? user : currentUser;

	return (
		<div className='flex flex-col h-full'>
			<ChatHeader
				authorName={isOwnChat ? "Избранное" : otherMember.name}
				authorPic={otherMember.imageUrl}
				variant={isOwnChat ? "savedMessaged" : "chat"}
				conversationId={conversation ? conversation.id : null}
				isOwnChat={isOwnChat}
			/>
			<div className='max-w-[720px] w-full mx-auto flex flex-col flex-1'>
				<div className='flex flex-col flex-1'>messages</div>
				<ChatInput
					users={[currentUser, user]}
					conversationId={conversation ? conversation.id : null}
				/>
			</div>
		</div>
	);
};
export default ChatWithUser;
