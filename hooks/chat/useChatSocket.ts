import {useEffect} from "react";
import {useQueryClient} from "@tanstack/react-query";

import {useSocket} from "@/providers/SocketProvider";
import {DirectMessage} from "@prisma/client";
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

		socket.on(addKey, (message: DirectMessage) => {
			// queryClient.setQueryData([queryKey], (oldData: any) => {
			// 	if (!oldData || !oldData.pages || oldData.pages.length === 0) {
			// 		return {
			// 			pages: [
			// 				{
			// 					items: [message],
			// 				},
			// 			],
			// 		};
			// 	}
			// 	const newData = [...oldData.pages];
			// 	newData[0] = {
			// 		...newData[0],
			// 		items: [message, ...newData[0].items],
			// 	};
			// 	return {
			// 		...oldData,
			// 		pages: newData,
			// 	};
			// });
			// revalidate chats
			// queryClient.setQueryData(["chats"], (oldData: any) => []);
		});

		socket.on(deleteKey, () => {
			router.refresh();
			queryClient.removeQueries({queryKey: [queryKey]});
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
