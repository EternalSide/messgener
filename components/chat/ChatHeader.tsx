"use client";
import Image from "next/image";
import {Settings, Trash2} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {NO_USER_IMAGE, SAVED_CHAT_PICTURE} from "@/constants";
import {MobileSidebar} from "../MobileSidebar";
import axios from "axios";
import {useRouter} from "next/navigation";
import {ConnectionStatus} from "../ConnectionStatus";

interface Props {
	authorName: string;
	authorPic: string | null;
	variant: "chat" | "savedMessaged";
	conversationId: string | null;
	isOwnChat: boolean;
}

const ChatHeader = ({
	authorName,
	authorPic,
	variant,
	conversationId,
	isOwnChat,
}: Props) => {
	const router = useRouter();

	const deleteChat = async () => {
		try {
			await axios.delete(`/api/conversations/${conversationId}`);
			router.push("/");
		} catch (e) {
			console.log(e);
		}
	};
	return (
		<div className='w-full dark:bg-[#212121] bg-white min-h-16 py-1.5 px-5 flex items-center justify-between'>
			<div className='flex items-center gap-2.5 w-full'>
				<MobileSidebar />
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
				</div>
			</div>
			<div className='flex items-center gap-3'>
				<ConnectionStatus />
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Settings className='h-6 w-6 text-neutral-400' />
					</DropdownMenuTrigger>
					<DropdownMenuContent className='w-[270px] px-1.5 py-2 bg-[#fdfdfd] dark:bg-[#242424] opacity-[99%] ml-4 rounded-lg'>
						<DropdownMenuItem
							className='flex items-center gap-3'
							disabled={!conversationId || isOwnChat}
							onClick={deleteChat}
						>
							<Trash2 className='h-5 w-5 text-neutral-400' /> Удалить чат
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
};
export default ChatHeader;
