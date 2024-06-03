import {MotionDiv} from "@/components/shared/MotionDiv";
import ChatCard from "@/components/chat/ChatCard";
import {ScrollArea} from "@/components/ui/scroll-area";
import {sidebarAnimations} from "@/constants";
import {formatDate} from "@/lib/utils";
import {ChatWithUsersAndMessages, SideBarVariant} from "@/types";
import {User} from "@prisma/client";

interface Props {
	currentUser: User;
	sidebarVariant: SideBarVariant;
	chats: ChatWithUsersAndMessages[];
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
							otherUserName={user.name}
							otherUserPic={user?.profilePic}
							otherUserUsername={user.username}
							variant='user'
						/>
					))}
				{sidebarVariant === "chats" && (
					<ul>
						{chats.map((chat: ChatWithUsersAndMessages) => {
							const lastMessage =
								chat?.directMessages[chat?.directMessages?.length - 1];
							const otherUser =
								chat.userOne.id === currentUser.id
									? chat.userTwo
									: chat.userOne;
							return (
								<ChatCard
									key={otherUser.id}
									otherUserName={
										otherUser.name === currentUser?.name
											? "Избранное"
											: otherUser.name
									}
									otherUserPic={
										otherUser.name === currentUser?.name
											? currentUser?.profilePic
											: otherUser.profilePic
									}
									otherUserUsername={otherUser.username}
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
