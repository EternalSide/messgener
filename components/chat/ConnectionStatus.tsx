"use client";
import {useSocket} from "@/providers/SocketProvider";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";

export const ConnectionStatus = () => {
	const {isConnected} = useSocket();

	return (
		<Badge
			variant='outline'
			className={cn(
				"dark:bg-primary bg-[#3390ec] text-white border-none",
				isConnected ? "dark:bg-primary bg-[#3390ec]" : "bg-yellow-600"
			)}
		>
			{isConnected ? "connected" : "connecting"}
		</Badge>
	);
};
