import {MotionDiv} from "@/components/shared/MotionDiv";
import ChatCard from "@/components/chat/ChatCard";
import {ScrollArea} from "@/components/ui/scroll-area";
import {sidebarAnimations} from "@/constants";
import {formatDate} from "@/lib/utils";
import {ConversationWithUsersAndMessages, SideBarVariant} from "@/types";
import {User} from "@prisma/client";

interface Props {
	currentUser: User;
	sidebarVariant: SideBarVariant;
	chats: ConversationWithUsersAndMessages[];
	users: User[];
}

const LeftSidebarContent = ({
	currentUser,
	sidebarVariant,
	chats,
	users,
}: Props) => {
	return (
		<MotionDiv
			key={sidebarVariant}
			variants={sidebarAnimations}
			initial='hidden'
			animate='visible'
			exit='exit'
			transition={{duration: 0.3}}
			className='h-full'
		>
			<ScrollArea className='mt-2 px-2.5 flex flex-col flex-1 h-full'>
				{sidebarVariant === "users" &&
					users.map((user: User) => (
						<ChatCard
							key={user.id}
							authorName={user.name}
							authorPic={user.imageUrl}
							authorUsername={user?.username ? user.username : user.id}
							variant='user'
						/>
					))}
				{sidebarVariant === "chats" && (
					<ul>
						{chats.map((chat: ConversationWithUsersAndMessages) => {
							const lastMessage =
								chat?.directMessages[chat?.directMessages?.length - 1];
							const otherUser =
								chat.userOne.id === currentUser.id
									? chat.userTwo
									: chat.userOne;
							return (
								<ChatCard
									key={otherUser.id}
									authorName={
										otherUser.name === currentUser?.name
											? "Избранное"
											: otherUser.name
									}
									authorPic={
										otherUser.name === currentUser?.name
											? currentUser?.imageUrl
											: otherUser.imageUrl
									}
									authorUsername={otherUser.username}
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
