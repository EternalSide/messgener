import {MotionDiv} from "@/components/MotionDiv";
import ChatCard from "@/components/chat/ChatCard";
import {ScrollArea} from "@/components/ui/scroll-area";
import {SAVED_CHAT_PICTURE, sidebarAnimations} from "@/constants";
import useSidebarUsers from "@/hooks/sidebar/useSidebarUsers";
import {formatDate} from "@/lib/utils";
import {SideBarVariant} from "@/types";
import {User} from "@prisma/client";

interface Props {
	currentUser: User;
	state: SideBarVariant;
	chats: any;
}

const LeftSidebarContent = ({currentUser, state, chats}: Props) => {
	const users = useSidebarUsers(state);

	return (
		<MotionDiv
			key={state}
			variants={sidebarAnimations}
			initial='hidden'
			animate='visible'
			exit='exit'
			transition={{duration: 0.3}}
		>
			<ScrollArea className='mt-2 px-2.5 flex flex-col h-full border-none'>
				{state === "users" &&
					users.map((user: User) => (
						<ChatCard
							key={user.id}
							authorName={user.name}
							authorPic={user.imageUrl}
							authorUsername={user?.username ? user.username : user.id}
							lastMessage='privet'
							lastMessageTime='20:32'
							variant='user'
						/>
					))}
				{state === "chats" && (
					<ul>
						{chats.map((chat: any) => {
							const lastMessage =
								chat?.directMessages[chat?.directMessages?.length - 1];
							return (
								<ChatCard
									key={chat.userTwo.id}
									authorName={
										chat.userTwo.name === currentUser?.name
											? "Избранное"
											: chat.userTwo.name
									}
									authorPic={
										chat.userTwo.name === currentUser?.name
											? SAVED_CHAT_PICTURE
											: chat.userTwo.imageUrl
									}
									authorUsername={chat.userTwo.username}
									lastMessage={lastMessage?.content}
									lastMessageTime={
										lastMessage?.createdAt
											? formatDate(lastMessage.createdAt)
											: null
									}
									variant='chat'
								/>
							);
						})}
					</ul>
				)}
			</ScrollArea>
		</MotionDiv>
	);
};
export default LeftSidebarContent;
