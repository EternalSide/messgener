"use client";

import ChatCard from "@/components/chat/ChatCard";
import {ScrollArea} from "@/components/ui/scroll-area";
import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";

const LeftSidebarContent = ({currentUser}: any) => {
	const pathname = usePathname();
	const [content, setContent] = useState([]);

	// useEffect(() => {
	// 	if (pathname === "/users") {
	// 		const users = await getUsers();
	// 	}
	// }, [pathname]);

	return (
		<ScrollArea className='mt-2 px-2.5 flex flex-col h-full border-none'>
			{pathname === "/users" &&
				[0].map((item: any) => (
					<ChatCard
						key={item}
						authorName={"tenderlybae"}
						authorPic={
							"https://i.pinimg.com/736x/b7/20/64/b72064a80c2c7e187f63dcd940b0be05.jpg"
						}
						authorUsername={currentUser.id}
						lastMessage='privet'
						lastMessageTime='20:32'
						variant='user'
					/>
				))}
			{pathname !== "/users" &&
				[0].map((item: any) => (
					<ChatCard
						key={item}
						authorName={"Избранное"}
						authorPic={
							"https://i.pinimg.com/736x/fb/77/01/fb77018d77242ed8987ad1a8356139ee.jpg"
						}
						authorUsername={currentUser.id}
						lastMessage='privet'
						lastMessageTime='20:32'
						variant='chat'
					/>
				))}
		</ScrollArea>
	);
};
export default LeftSidebarContent;
