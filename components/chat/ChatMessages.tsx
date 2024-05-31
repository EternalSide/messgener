"use client";
import {useChatQuery} from "@/hooks/chat/useChatQuery";
import {useChatSocket} from "@/hooks/chat/useChatSocket";
import {formatDate} from "@/lib/utils";
import {DirectMessage} from "@prisma/client";
import {Loader2, ServerCrash} from "lucide-react";
import {Fragment, useRef} from "react";
import {ChatItem} from "./ChatItem";
import ChatEmpty from "../chat-empty";
import {NO_CHAT_SELECTED_IMAGE} from "@/constants";
import {useChatScroll} from "@/hooks/chat/useChatScroll";
import Loader from "../Loader";

interface Props {
	chatId: string | null;
	currentUser: any;
}

const ChatMessages = ({chatId, currentUser}: Props) => {
	const chatRef = useRef<HTMLDivElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);
	const queryKey = `chat:${chatId}`;
	const addKey = `chat:${chatId}:messages`;
	const updateKey = `chat:${chatId}:messages:update`;
	const deleteKey = `chat:${chatId}:messages:delete`;

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		status,
		isLoading,
	} = useChatQuery({
		queryKey,
		conversationId: chatId ? chatId : null,
	});

	useChatSocket({queryKey, addKey, updateKey, deleteKey});

	useChatScroll({
		chatRef,
		bottomRef,
		loadMore: fetchNextPage,
		shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
		count: data?.pages?.[0]?.items?.length ?? 0,
	});

	if (isLoading) {
		return <Loader />;
	}

	if (status === "error") {
		return (
			<div className='flex flex-col flex-1 justify-center items-center'>
				<ServerCrash className='h-7 w-7 text-zinc-500 my-4' />
				<p className='text-xs text-zinc-500 dark:text-zinc-400'>
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
				<ChatEmpty
					src={NO_CHAT_SELECTED_IMAGE}
					h1='Сообщения не найдены...'
					h3=''
				/>
			)}
			{hasNextPage && (
				<div className='flex justify-center'>
					{isFetchingNextPage ? (
						<Loader2 className='h-6 w-6 text-zinc-500 animate-spin my-4' />
					) : (
						<button
							onClick={() => fetchNextPage()}
							className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition'
						>
							Загрузить прошлые сообщения
						</button>
					)}
				</div>
			)}
			<div className='flex flex-col-reverse mt-auto gap-1.5'>
				{data?.pages?.map((messages, i) => (
					<Fragment key={i}>
						{messages.items.map(
							(message: DirectMessage & {isOwnMessage?: boolean}) => {
								const isOwnMessage = message?.isOwnMessage
									? true
									: currentUser.id === message.userId;
								return (
									<ChatItem
										key={message.id}
										deleted={message.deleted}
										isOwnMessage={isOwnMessage}
										content={message.content}
										createdAt={formatDate(new Date(message.createdAt))}
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
