"use client";
import {useChatQuery} from "@/hooks/chat/useChatQuery";
import {useChatSocket} from "@/hooks/chat/useChatSocket";
import {formatDate} from "@/lib/utils";
import {DirectMessage, User} from "@prisma/client";
import {ServerCrash} from "lucide-react";
import {Fragment, useRef} from "react";
import {ChatItem} from "./ChatItem";
import {NO_CHAT_SELECTED_IMAGE} from "@/constants";
import {useChatScroll} from "@/hooks/chat/useChatScroll";
import Loader from "../shared/Loader";
import ChatWelcome from "./ChatWelcome";
import {Button} from "../ui/button";

interface Props {
	chatId: string | null;
	currentUser: User;
	otherUserId: string;
}

const ChatMessages = ({chatId, currentUser, otherUserId}: Props) => {
	const chatRef = useRef<HTMLDivElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		status,
		isLoading,
	} = useChatQuery({
		chatId: chatId ? chatId : null,
	});
	useChatSocket({chatId: chatId as string});

	useChatScroll({
		chatRef,
		bottomRef,
		loadMore: fetchNextPage,
		shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
		// @ts-ignore
		count: data?.pages?.[0]?.items?.length ?? 0,
	});

	if (isLoading) return <Loader />;

	if (status === "error") {
		return (
			<div className='flex flex-col flex-1 justify-center items-center'>
				<ServerCrash className='h-7 w-7 text-neutral-500 my-4' />
				<p className='text-sm text-neutral-500 dark:text-neutral-400'>
					Что-то пошло не так...
				</p>
			</div>
		);
	}

	return (
		<div
			ref={chatRef}
			className=' flex-1 flex flex-col py-4 overflow-y-auto scrollbar-hide'
		>
			{!hasNextPage && <div className='flex-1' />}
			{!chatId && (
				<ChatWelcome
					src={NO_CHAT_SELECTED_IMAGE}
					h1='Сообщения не найдены...'
					h3='Отправить привествие?'
					variant='chat'
					chatId={chatId}
					userOneId={currentUser.id}
					userTwoId={otherUserId}
				/>
			)}
			{hasNextPage && isFetchingNextPage && (
				<div className='flex justify-center'>
					{isFetchingNextPage ? (
						<Loader />
					) : (
						<Button
							onClick={() => fetchNextPage()}
							className='my-4'
						>
							Загрузить прошлые сообщения
						</Button>
					)}
				</div>
			)}
			<div className='flex flex-col-reverse mt-auto gap-1.5'>
				{data?.pages?.map((messages: any, i) => (
					<Fragment key={i}>
						{messages.items.map(
							(message: DirectMessage & {isOwnMessage?: boolean}) => {
								const isOwnMessage = message?.isOwnMessage
									? true
									: currentUser.id === message.userId;
								return (
									<ChatItem
										key={message.id}
										chatId={message.chatId}
										messageId={message.id}
										isOwnMessage={isOwnMessage}
										content={message.content}
										createdAt={formatDate(message.createdAt)}
									/>
								);
							}
						)}
					</Fragment>
				))}
			</div>
			<div ref={bottomRef} />
		</div>
	);
};
export default ChatMessages;
