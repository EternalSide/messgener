import ChatHeader from "@/components/chat/ChatHeader";
import {ChatInput} from "@/components/chat/ChatInput";
import {getCurrentUser} from "@/lib/current-user";
import {db} from "@/lib/db";
import {getOrCreateConversation} from "@/lib/getOrCreateConversation";
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

	// 404 заглушка если начинаем чат, с несуществующим пользователем.
	if (!user) return redirect("/");

	const conversation = await getOrCreateConversation(currentUser.id, user.id);

	if (!conversation) {
		return redirect(`/`);
	}

	// user может не иметь username, тогда сравниваем по id
	const userId = currentUser?.username || currentUser?.userId;
	const isOwnChat = params.userId === userId;

	const {userOne, userTwo} = conversation;
	const otherMember = userOne.id === currentUser.id ? userTwo : userOne;

	return (
		<div className='flex flex-col h-full'>
			<ChatHeader
				authorName={isOwnChat ? "Избранное" : otherMember.name}
				authorPic={otherMember.imageUrl}
				authorUsername={otherMember.id}
				variant={isOwnChat ? "savedMessaged" : "chat"}
			/>
			<div className='max-w-[720px] w-full mx-auto flex flex-col flex-1'>
				<div className='flex flex-col flex-1'>messages</div>
				<ChatInput
					name={otherMember.name}
					apiUrl='/api/socket/direct-messages'
					query={{
						conversationId: conversation.id,
					}}
				/>
			</div>
		</div>
	);
};
export default ChatWithUser;
