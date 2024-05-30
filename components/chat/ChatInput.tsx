"use client";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {EmojiPicker} from "../EmojiPicker";
import {SendHorizonal} from "lucide-react";
import {Button} from "../ui/button";
import {useChats} from "@/hooks/useChats";

interface ChatInputProps {
	apiUrl: string;
	query: Record<string, any>;
	name: string;
}

const formSchema = z.object({
	content: z.string().min(1),
});

export const ChatInput = ({apiUrl, query, name}: ChatInputProps) => {
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			content: "",
		},
	});

	const isLoading = form.formState.isSubmitting;
	const {userChats, setUserChats} = useChats();

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: apiUrl,
				query,
			});

			const {data} = await axios.post(url, values);

			const {conversation: newConversation, message} = data;
			const chats = [newConversation, ...userChats];

			const currentChat = userChats.find(
				(chat: any) => chat.id === newConversation.id
			);
			currentChat.directMessages.push(message);

			const otherChats = userChats.filter(
				(chat: any) => chat.id !== currentChat.id
			);

			const sortedMessages = [currentChat, ...otherChats];
			setUserChats(sortedMessages);

			form.reset();
			router.refresh();
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<Form {...form}>
			<form
				className='flex items-center '
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<FormField
					control={form.control}
					name='content'
					render={({field}) => (
						<FormItem className='flex-1 flex'>
							<FormControl>
								<div className='relative p-4 pr-2 w-full'>
									{/* <button
										type='button'
										onClick={() => onOpen("messageFile", {apiUrl, query})}
										className='absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center'
									>
										<Plus className='text-white dark:text-[#313338]' />
									</button> */}
									<Input
										disabled={isLoading}
										className='px-12 text-base py-8 border-none placeholder:text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'
										placeholder={`Сообщение ${name}`}
										{...field}
									/>
									<div className='absolute top-9 left-8'>
										<EmojiPicker
											onChange={(emoji: string) =>
												field.onChange(`${field.value} ${emoji}`)
											}
										/>
									</div>
								</div>
							</FormControl>
						</FormItem>
					)}
				/>
				<Button className='bg-primary rounded-full px-5 py-8'>
					<SendHorizonal
						color='white'
						className='h-7 w-7'
					/>
				</Button>
			</form>
		</Form>
	);
};
