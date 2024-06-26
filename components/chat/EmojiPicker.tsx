"use client";
import {Smile} from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import {useTheme} from "next-themes";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

interface EmojiPickerProps {
	onChange: (value: string) => void;
}

export const EmojiPicker = ({onChange}: EmojiPickerProps) => {
	const {resolvedTheme} = useTheme();

	return (
		<Popover>
			<PopoverTrigger>
				<Smile className='text-neutral-500 dark:text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition' />
			</PopoverTrigger>
			<PopoverContent
				side='right'
				sideOffset={40}
				className='bg-transparent border-none shadow-none drop-shadow-none mb-16 -ml-16'
			>
				<Picker
					theme={resolvedTheme}
					data={data}
					onEmojiSelect={(emoji: any) => onChange(emoji.native)}
				/>
			</PopoverContent>
		</Popover>
	);
};
