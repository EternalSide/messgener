import {useInfiniteQuery} from "@tanstack/react-query";
import {useSocket} from "@/providers/SocketProvider";
import {usePathname} from "next/navigation";
import {getMessages} from "@/lib/actions/chat.action";
import {getSocketKeys} from "@/lib/utils";

interface Props {
	chatId: string | null;
}

export const useChatQuery = ({chatId}: Props) => {
	const {isConnected} = useSocket();
	const path = usePathname();
	const {queryKey} = getSocketKeys(chatId);

	const fetchMessages = async ({pageParam = undefined}) => {
		const data = await getMessages({
			cursor: pageParam,
			chatId: chatId ? chatId : path?.slice(1),
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
