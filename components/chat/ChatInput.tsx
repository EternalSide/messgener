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
import {useQueryClient} from "@tanstack/react-query";
import {createNewConversation} from "@/lib/actions/conversation.action";
import {messageSchema} from "@/lib/validation";
import {User} from "@prisma/client";

interface ChatInputProps {
	users: User[];
	conversationId: string | null;
}

export const ChatInput = ({users, conversationId}: ChatInputProps) => {
	const queryClient = useQueryClient();
	const router = useRouter();
	const form = useForm<z.infer<typeof messageSchema>>({
		resolver: zodResolver(messageSchema),
		defaultValues: {
			content: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof messageSchema>) => {
		try {
			const isFirstMessage = conversationId === null;
			let initialConversation;
			let firstChat: any;
			const chats: any = queryClient.getQueriesData({queryKey: ["chats"]});

			if (isFirstMessage) {
				initialConversation = await createNewConversation(
					users[0].id,
					users[1].id
				);
			}

			const url = qs.stringifyUrl({
				url: "/api/socket/direct-messages",
				query: {
					conversationId: isFirstMessage
						? initialConversation?.id!
						: conversationId,
				},
			});

			const {data} = await axios.post(url, values);
			const {conversation, message} = data;

			if (isFirstMessage) {
				firstChat = {
					...conversation,
					directMessages: [message],
				};
				const otherChats = chats.filter(
					(chat: any) => chat.id !== firstChat.id
				);
				queryClient.setQueryData(["chats"], () => [firstChat, ...otherChats]);
			} else {
				const currentChat = chats.find(
					(chat: any) => chat.id === conversation.id
				);
				currentChat.directMessages.push(message);

				const otherChats = chats.filter(
					(chat: any) => chat.id !== currentChat.id
				);
				queryClient.setQueryData(["chats"], () => [currentChat, ...otherChats]);
			}

			queryClient.invalidateQueries({queryKey: ["chats"]});
			form.reset();
			if (isFirstMessage) return router.refresh();
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
									<Input
										disabled={form.formState.isSubmitting}
										className='px-12 text-base py-8 border-none placeholder:text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'
										placeholder={`Введите сообщение...`}
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
