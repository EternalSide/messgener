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
import {Chat} from "@prisma/client";
import {ChatWithUsersAndMessages} from "@/types";
import {Button} from "../ui/button";

interface Props {
	title: string;
	picture: string | null;
	chatId: string | null;
	isOwnChat?: boolean;
	type: "channel" | "chat";
	isCreator?: boolean;
}

const ChatHeader = ({
	title,
	picture,
	chatId,
	isOwnChat,
	type,
	isCreator,
}: Props) => {
	const {onOpen} = useModal();
	const queryClient = useQueryClient();

	const deleteChat = async () => {
		try {
			queryClient.setQueriesData(
				{queryKey: ["chats"]},
				(chats: ChatWithUsersAndMessages[] | undefined) =>
					chats && chats.filter((chat: Chat) => chat.id !== chatId)
			);

			await axios.delete(`/api/socket/chats/${chatId}`);
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
							imgSrc: picture || NO_USER_IMAGE,
							name: title,
						})
					}
					className='h-12 min-w-12 relative cursor-pointer transition hover:opacity-90'
				>
					<Image
						className='rounded-full object-top'
						fill
						alt={title}
						src={picture || NO_USER_IMAGE}
					/>
				</div>
				<div>
					<h3 className='font-semibold'>{title}</h3>
					{type === "channel" && (
						<p className='text-sm text-neutral-600 dark:text-neutral-400'>
							0 участников
						</p>
					)}
				</div>
			</div>
			<div className='flex items-center gap-3'>
				{type === "chat" && <ConnectionStatus />}
				{type === "channel" && (
					<Button className='px-6 rounded-xl text-base'>Вступить</Button>
				)}
				{type === "chat" && (
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Settings className='h-6 w-6 text-neutral-400' />
						</DropdownMenuTrigger>
						<DropdownMenuContent className='w-[270px] px-1.5 py-2 bg-[#fdfdfd] dark:bg-[#242424] opacity-[99%] ml-4 rounded-lg'>
							<DropdownMenuItem
								className='flex items-center gap-3'
								disabled={!chatId || isOwnChat}
								onClick={deleteChat}
							>
								<Trash2 className='h-5 w-5 text-neutral-400' /> Удалить чат
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
		</div>
	);
};
export default ChatHeader;
