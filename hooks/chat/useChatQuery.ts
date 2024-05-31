import {useInfiniteQuery} from "@tanstack/react-query";
import {useSocket} from "@/providers/SocketProvider";
import {usePathname} from "next/navigation";
import {getMessages} from "@/lib/actions/conversation.action";

interface ChatQueryProps {
	queryKey: string;
	conversationId: string | null;
}

export const useChatQuery = ({queryKey, conversationId}: ChatQueryProps) => {
	const {isConnected} = useSocket();
	const path = usePathname();

	const fetchMessages = async ({pageParam = undefined}) => {
		const data = await getMessages({
			cursor: pageParam,
			conversationId: conversationId ? conversationId : path?.slice(1),
		});
		return data;
	};

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		status,
		isLoading,
	} = useInfiniteQuery({
		queryKey: [queryKey],
		// @ts-ignore
		queryFn: ({pageParam = 1}) => fetchMessages({pageParam: pageParam}),
		getNextPageParam: (lastPage) => lastPage?.nextCursor,
		refetchInterval: isConnected ? false : 1000,
		initialPageParam: null,
	});

	return {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		status,
		isLoading,
	};
};
