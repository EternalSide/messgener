import {useEffect} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {useSocket} from "@/providers/SocketProvider";
import {Chat, DirectMessage} from "@prisma/client";
import {useRouter} from "next/navigation";
import {getSocketKeys, sortChats} from "@/lib/utils";
import {SocketRes} from "@/types";

export const useChatSocket = ({chatId}: {chatId: string | null}) => {
	const {socket} = useSocket();
	const queryClient = useQueryClient();
	const router = useRouter();
	const {
		deleteChatKey,
		deleteMessageKey,
		queryKey,
		sendMessageKey,
		updateMessageKey,
	} = getSocketKeys(chatId);

	useEffect(() => {
		if (!socket) return;

		socket.on(sendMessageKey, ({chat, message}: SocketRes) => {
			queryClient.setQueryData([queryKey], (prevMessages: any) => {
				if (
					!prevMessages ||
					!prevMessages.pages ||
					prevMessages.pages.length === 0
				) {
					return {
						pages: [
							{
								items: [message],
							},
						],
					};
				}

				const newData = [...prevMessages.pages];

				newData[0] = {
					...newData[0],
					items: [message, ...newData[0].items],
				};
				return {
					...prevMessages,
					pages: newData,
				};
			});

			queryClient.setQueryData([`chats`], (prevChats: Chat[]) => {
				const chatsWihoutCurrent = prevChats.filter(
					(c: Chat) => c.id !== chat.id
				);

				const updatedChat = {
					...chat,
					directMessages: [...chat?.directMessages, message],
				};

				const newData = [updatedChat, ...chatsWihoutCurrent];
				return newData;
			});
		});

		socket.on(updateMessageKey, ({chat, message}: SocketRes) => {
			queryClient.setQueryData([queryKey], (prevMessages: any) => {
				if (
					!prevMessages ||
					!prevMessages.pages ||
					prevMessages.pages.length === 0
				)
					return prevMessages;

				const newData = prevMessages.pages.map((page: any) => {
					return {
						...page,
						items: page.items.filter((item: DirectMessage) => {
							if (item.id !== message.id) return item;
						}),
					};
				});

				return {
					...prevMessages,
					pages: newData,
				};
			});

			queryClient.setQueryData([`chats`], (prevChats: Chat[]) => {
				const chatsWihoutCurrent = prevChats.filter(
					(c: Chat) => c.id !== chat.id
				);

				const newMessages = chat?.directMessages.filter(
					(m: any) => m.id !== message.id
				);

				const updatedChat = {
					...chat,
					directMessages: newMessages,
				};

				const chats = [...chatsWihoutCurrent, updatedChat];

				const sortedChatsByLastMessage = sortChats(chats);
				return sortedChatsByLastMessage;
			});
		});

		socket.on(deleteChatKey, () => {
			queryClient.removeQueries({queryKey: [queryKey]});
			return router.refresh();
		});

		return () => {
			socket.off(sendMessageKey);
			socket.off(updateMessageKey);
			socket.off(deleteMessageKey);
			socket.off(deleteChatKey);
		};
	}, [
		queryClient,
		sendMessageKey,
		queryKey,
		socket,
		updateMessageKey,
		deleteMessageKey,
	]);
};
