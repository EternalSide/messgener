import {MotionDiv} from "@/components/MotionDiv";
import ChatCard from "@/components/chat/ChatCard";
import {ScrollArea} from "@/components/ui/scroll-area";
import {SAVED_CHAT_PICTURE, sidebarAnimations} from "@/constants";
import {useChats} from "@/hooks/useChats";
import {getAllUsers} from "@/lib/actions/user.action";
import {formatDate} from "@/lib/time";
import {SideBarVariant} from "@/types";
import {User} from "@prisma/client";
import {useEffect, useState} from "react";

interface Props {
	currentUser: User;
	state: SideBarVariant;
	chats: any;
}

const LeftSidebarContent = ({currentUser, state, chats}: Props) => {
	const [users, setUsers] = useState<User[] | []>([]);

	// initial chats loading

	const {userChats, setUserChats} = useChats();

	useEffect(() => {
		if (chats || userChats) {
			const sortedMessages = chats.sort((a: any, b: any) => {
				const lastMessagea = a.directMessages[a.directMessages.length - 1];
				const at = lastMessagea.createdAt;
				const lastMessageb = b.directMessages[b.directMessages.length - 1];
				const bt = lastMessageb.createdAt;
				return new Date(bt).getTime() - new Date(at).getTime();
			});

			setUserChats(sortedMessages);
		}
	}, []);

	useEffect(() => {
		const getUsers = async () => {
			const allUsers = await getAllUsers();
			setUsers(allUsers);
			return users;
		};

		if (state === "users") {
			getUsers();
		}
	}, [state]);

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
						{userChats.map((chat: any) => {
							const lastMessage =
								chat.directMessages[chat.directMessages.length - 1];
							return (
								<ChatCard
									key={chat.userTwo.id}
									authorName={
										chat.userTwo.name === currentUser.name
											? "Избранное"
											: chat.userTwo.name
									}
									authorPic={
										chat.userTwo.name === currentUser.name
											? SAVED_CHAT_PICTURE
											: chat.userTwo.imageUrl
									}
									authorUsername={chat.userTwo.username}
									lastMessage={lastMessage?.content}
									lastMessageTime={formatDate(lastMessage.createdAt)}
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
