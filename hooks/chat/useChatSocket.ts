import {useEffect} from "react";
import {useQueryClient} from "@tanstack/react-query";

import {useSocket} from "@/providers/SocketProvider";
import {Conversation, DirectMessage} from "@prisma/client";
import {useRouter} from "next/navigation";

type ChatSocketProps = {
	addKey: string;
	updateKey: string;
	queryKey: string;
	deleteKey: string;
};

export const useChatSocket = ({
	addKey,
	updateKey,
	queryKey,
	deleteKey,
}: ChatSocketProps) => {
	const {socket} = useSocket();
	const queryClient = useQueryClient();
	const router = useRouter();

	useEffect(() => {
		if (!socket) return;

		socket.on(addKey, ({conversation, message}: any) => {
			queryClient.setQueryData([queryKey], (conversations: any) => {
				const isFirst =
					!conversations ||
					!conversations.pages ||
					conversations.pages.length === 0;

				if (isFirst) {
					return {
						pages: [
							{
								items: [message],
							},
						],
					};
				}

				const newData = [...conversations.pages];

				newData[0] = {
					...newData[0],
					items: [message, ...newData[0].items],
				};
				return {
					...conversations,
					pages: newData,
				};
			});
			queryClient.setQueryData([`chats`], (oldData: Conversation[]) => {
				const chatsWihoutCurrent = oldData.filter(
					(chat: Conversation) => chat.id !== conversation.id
				);

				const newConversation = {
					...conversation,
					directMessages: [...conversation?.directMessages, message],
				};

				const newData = [newConversation, ...chatsWihoutCurrent];
				return newData;
			});
		});
		// update sidebar
		socket.on(deleteKey, () => {
			queryClient.removeQueries({queryKey: [queryKey]});
			router.refresh();
		});

		// update message
		// socket.on(updateKey, (message: DirectMessage) => {
		// 	queryClient.setQueryData([queryKey], (oldData: any) => {
		// 		if (!oldData || !oldData.pages || oldData.pages.length === 0)
		// 			return oldData;

		// 		const newData = oldData.pages.map((page: any) => {
		// 			return {
		// 				...page,
		// 				items: page.items.map((item: DirectMessage) => {
		// 					if (item.id === message.id) return message;
		// 					return item;
		// 				}),
		// 			};
		// 		});

		// 		return {
		// 			...oldData,
		// 			pages: newData,
		// 		};
		// 	});
		// });

		return () => {
			socket.off(addKey);
			socket.off(updateKey);
			socket.off(deleteKey);
		};
	}, [queryClient, addKey, queryKey, socket, updateKey, deleteKey]);
};
