"use client";
import {NO_USER_IMAGE} from "@/constants";
import {cn} from "@/lib/utils";
import {SidebarCardType} from "@/types";
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";

interface Props {
	title: string;
	picture: string | null;
	link: string;
	lastMessage?: string;
	lastMessageTime?: string | null;
	variant: SidebarCardType;
}

const SidebarCard = ({
	title,
	picture,
	link,
	lastMessage,
	lastMessageTime,
	variant,
}: Props) => {
	const path = usePathname();
	const isChannel = variant === "channel";
	const isChat = variant === "chat";
	const href = isChannel ? `/channel/${link}` : `/chat/${link}`;
	const isSelected = path === href;

	return (
		<Link
			href={href}
			className={cn(
				"px-3 py-3 rounded-lg flex items-center  transition",
				isSelected
					? "dark:bg-primary bg-[#3390ec]"
					: "dark:hover:bg-neutral-800 hover:bg-neutral-200/50"
			)}
		>
			<div className='flex items-center gap-2.5 w-full'>
				<div className='h-14 min-w-14 relative '>
					<Image
						className='rounded-full object-top'
						fill
						alt={title}
						src={picture || NO_USER_IMAGE}
					/>
				</div>
				<div className='w-full'>
					<div className='flex items-start justify-between'>
						<h3 className={cn("font-semibold", isSelected && "text-white")}>
							{title}
						</h3>
						{(isChat || isChannel) && lastMessageTime && (
							<p
								className={cn(
									"text-xs text-neutral-500",
									isSelected && "text-white"
								)}
							>
								{lastMessageTime}
							</p>
						)}
					</div>
					{(variant === "chat" || variant === "channel") && (
						<p
							className={cn(
								"font-normal mt-1 line-clamp-1 text-neutral-800 dark:text-neutral-300",
								isSelected && "text-white"
							)}
						>
							{lastMessage}
						</p>
					)}
					{variant === "user" && (
						<p
							className={cn(
								"font-normal mt-1 text-neutral-600 dark:text-neutral-400",
								isSelected && "text-white"
							)}
						>
							@{link}
						</p>
					)}
				</div>
			</div>
		</Link>
	);
};
export default SidebarCard;
