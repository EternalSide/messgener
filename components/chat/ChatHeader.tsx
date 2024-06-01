"use client";
import Image from "next/image";
import {Settings, Trash2} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {NO_USER_IMAGE} from "@/constants";
import {MobileSidebar} from "../shared/Sidebar/MobileSidebar";
import axios from "axios";
import {ConnectionStatus} from "./ConnectionStatus";
import {useModal} from "@/hooks/useModalStore";
import {useQueryClient} from "@tanstack/react-query";
import {Conversation} from "@prisma/client";

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
	const {onOpen} = useModal();
	const queryClient = useQueryClient();

	const deleteChat = async () => {
		try {
			queryClient.setQueriesData({queryKey: ["chats"]}, (chats: any) =>
				chats.filter((chat: Conversation) => chat.id !== conversationId)
			);

			await axios.delete(`/api/socket/conversations/${conversationId}`);
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<div className='w-full dark:bg-dark bg-light min-h-16 py-1.5 px-5 flex items-center justify-between border-b dark:border-black border-white shadow-md'>
			<div className='flex items-center gap-2.5 w-full'>
				<MobileSidebar />
				<div
					onClick={() =>
						onOpen("userProfilePicture", {
							imgSrc: authorPic || NO_USER_IMAGE,
						})
					}
					className='h-12 min-w-12 relative cursor-pointer transition hover:opacity-90'
				>
					<Image
						className='rounded-full object-top'
						fill
						alt={authorName}
						src={authorPic || NO_USER_IMAGE}
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
