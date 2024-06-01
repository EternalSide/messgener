"use client";
import {NO_USER_IMAGE} from "@/constants";
import {cn} from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";

interface Props {
	authorName: string;
	authorPic: string | null;
	authorUsername: string;
	lastMessage?: string;
	lastMessageTime?: string | null;
	variant: "chat" | "user";
}

const ChatCard = ({
	authorName,
	authorPic,
	authorUsername,
	lastMessage,
	lastMessageTime,
	variant,
}: Props) => {
	const path = usePathname();
	const isActive = path === `/chat/${authorUsername}`;

	return (
		<Link
			href={`/chat/${authorUsername}`}
			className={cn(
				"px-3 py-3 rounded-lg flex items-center  transition",
				isActive
					? "dark:bg-primary bg-[#3390ec]"
					: "dark:hover:bg-neutral-800 hover:bg-neutral-200/50"
			)}
		>
			<div className='flex items-center gap-2.5 w-full'>
				<div className='h-14 min-w-14 relative '>
					<Image
						className='rounded-full object-top'
						fill
						alt={authorName}
						src={authorPic || NO_USER_IMAGE}
					/>
				</div>
				<div className='w-full'>
					<div className='flex items-start justify-between'>
						<h3 className={cn("font-semibold", isActive && "text-white")}>
							{authorName}
						</h3>
						{variant === "chat" && lastMessageTime && (
							<p
								className={cn(
									"text-xs text-neutral-400",
									isActive && "text-white"
								)}
							>
								{lastMessageTime}
							</p>
						)}
					</div>
					{variant === "chat" && (
						<p
							className={cn(
								"font-normal mt-1 line-clamp-1",
								isActive && "text-white"
							)}
						>
							{lastMessage}
						</p>
					)}
					{variant === "user" && (
						<p className={cn("font-normal mt-1", isActive && "text-white")}>
							@{authorUsername}
						</p>
					)}
				</div>
			</div>
		</Link>
	);
};
export default ChatCard;
