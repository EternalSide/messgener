import Image from "next/image";
import {SocketIndicator} from "../socket-indicator";
import {Settings, Trash2} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {NO_USER_IMAGE, SAVED_CHAT_PICTURE} from "@/constants";

interface Props {
	authorName: string;
	authorPic: string | null;
	authorUsername: string;
	variant: "chat" | "savedMessaged";
}

const ChatHeader = ({
	authorName,
	authorPic,
	authorUsername,
	variant,
}: Props) => {
	return (
		<div className='w-full dark:bg-[#212121] bg-white min-h-16 py-1.5 px-5 flex items-center justify-between'>
			<div className='flex items-center gap-2.5 w-full'>
				<div className='h-12 min-w-12 relative '>
					<Image
						className='rounded-full object-top'
						fill
						alt={authorName}
						src={
							variant === "savedMessaged"
								? SAVED_CHAT_PICTURE
								: authorPic || NO_USER_IMAGE
						}
					/>
				</div>
				<div>
					<h3 className='font-semibold'>{authorName}</h3>
					{variant === "chat" && (
						<p className='text-xs text-neutral-400'>был(а) недавно</p>
					)}
				</div>
			</div>
			<div className='flex items-center gap-3'>
				<SocketIndicator />
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Settings className='h-6 w-6 text-neutral-400' />
					</DropdownMenuTrigger>
					<DropdownMenuContent className='w-[270px] px-1.5 py-2 bg-[#fdfdfd] dark:bg-[#242424] opacity-[99%] ml-4 rounded-lg'>
						<DropdownMenuItem className='flex items-center gap-4'>
							<Trash2 className='h-5 w-5 text-neutral-400' /> Удалить чат
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
};
export default ChatHeader;
