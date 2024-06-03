import {MotionDiv} from "@/components/shared/MotionDiv";
import SidebarCard from "@/components/shared/Sidebar/SidebarCard";
import {ScrollArea} from "@/components/ui/scroll-area";
import {sidebarAnimations} from "@/constants";
import {generateChatData} from "@/lib/utils";
import {ChatWithUsersAndMessages, SideBarVariant} from "@/types";
import {Channel, User} from "@prisma/client";

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
						<SidebarCard
							key={user.id}
							title={user.name}
							picture={user?.profilePic}
							link={user.username}
							variant='user'
						/>
					))}
				{sidebarVariant === "chats" && (
					<ul>
						{chats.map((chat: ChatWithUsersAndMessages | Channel) => {
							const data = generateChatData(chat, currentUser);
							return (
								<SidebarCard
									key={chat.id}
									title={data.title}
									picture={data.picture}
									link={data.link}
									lastMessage={data.lastMessage}
									lastMessageTime={data.lastMessageTime}
									variant={data.variant}
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
