"use client";
import {cn} from "@/lib/utils";

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
	return (
		<div
			className={cn(
				"relative group flex items-center  p-4 py-1  transition w-fit rounded-3xl",
				isOwnMessage
					? "ml-auto bg-[#eeffde] dark:bg-primary"
					: "mr-auto  bg-white dark:bg-[#212121]"
			)}
		>
			<div className='flex flex-col w-full'>
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
		</div>
	);
};
