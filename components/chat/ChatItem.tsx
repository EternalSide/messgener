"use client";
import {cn} from "@/lib/utils";
import {useState} from "react";
import {Edit, Trash} from "lucide-react";
import ActionTooltip from "../shared/ActionTooltip";

interface Props {
	content: string;
	createdAt: string;
	deleted: boolean;
	isOwnMessage: boolean;
}

export const ChatItem = ({
	content,
	isOwnMessage,
	deleted,
	createdAt,
}: Props) => {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	return (
		<div
			className={cn(
				"relative group flex items-center  p-4 py-1  transition w-fit rounded-3xl",
				isOwnMessage
					? "ml-auto bg-[#eeffde] dark:bg-primary"
					: "mr-auto  bg-light dark:bg-dark"
			)}
		>
			<div
				onClick={() => setIsSettingsOpen(true)}
				onContextMenu={() => setIsSettingsOpen(true)}
				className='flex flex-col w-full'
			>
				<p
					className={cn(
						"text-base text-zinc-600 dark:text-zinc-300 pr-10 ",
						deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
					)}
				>
					{content}
				</p>
				<p className='text-xs dark:text-neutral-200 ml-auto '>{createdAt}</p>
			</div>

			<div className='hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-3 -right-1 z-10 bg-white dark:bg-zinc-800 border rounded-sm'>
				{isOwnMessage && (
					<ActionTooltip label='Изменить'>
						<Edit className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition' />
					</ActionTooltip>
				)}
				<ActionTooltip label='Удалить'>
					<Trash className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition' />
				</ActionTooltip>
			</div>
		</div>
	);
};
