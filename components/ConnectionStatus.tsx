"use client";
import {useSocket} from "@/providers/SocketProvider";
import {Badge} from "@/components/ui/badge";

export const ConnectionStatus = () => {
	const {isConnected} = useSocket();

	if (!isConnected) {
		return (
			<Badge
				variant='outline'
				className='bg-yellow-600 text-white border-none'
			>
				connecting
			</Badge>
		);
	}

	return (
		<Badge
			variant='outline'
			className='dark:bg-primary bg-[#3390ec] text-white border-none'
		>
			connected
		</Badge>
	);
};
