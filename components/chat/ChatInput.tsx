"use client";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {EmojiPicker} from "../EmojiPicker";
import {SendHorizonal} from "lucide-react";
import {Button} from "../ui/button";
import {useQueryClient} from "@tanstack/react-query";
import {createNewConversation} from "@/lib/actions/conversation.action";
import {messageSchema} from "@/lib/validation";
import {Conversation, User} from "@prisma/client";
import {cn} from "@/lib/utils";
import {useUpdateMessages} from "@/hooks/sidebar/useUpdateMessages";

interface ChatInputProps {
	users: User[];
	conversationId: string | null;
}

export const ChatInput = ({users, conversationId}: ChatInputProps) => {
	const queryClient = useQueryClient();

	const form = useForm<z.infer<typeof messageSchema>>({
		resolver: zodResolver(messageSchema),
		defaultValues: {
			content: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof messageSchema>) => {
		form.reset();
		useUpdateMessages(queryClient, conversationId, values.content);

		try {
			const settings: {
				isFirstMessage: boolean;
				initialConversation: null | Conversation;
				initialConversationLocal: null | Conversation;
			} = {
				isFirstMessage: conversationId === null,
				initialConversation: null,
				initialConversationLocal: null,
			};

			// Первое сообщение пользователю.
			if (settings.isFirstMessage) {
				settings.initialConversation = await createNewConversation(
					users[0].id,
					users[1].id
				);
			}

			const url = qs.stringifyUrl({
				url: "/api/socket/direct-messages",
				query: {
					conversationId: settings.isFirstMessage
						? settings.initialConversation?.id!
						: conversationId,
				},
			});

			const {data} = await axios.post(url, values);
			const {conversation, message} = data;

			queryClient.setQueryData([`chats`], (oldData: any) => {
				const chatsWihoutCurrent = oldData.filter(
					(chat: any) => chat.id !== conversation.id
				);

				const newConversation = {
					...conversation,
					directMessages: [...conversation?.directMessages, message],
				};

				const newData = [newConversation, ...chatsWihoutCurrent];
				console.log(newConversation);
				return newData;
			});
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
										className='px-12 text-base bg-white dark:bg-[#212121] py-8 border-none placeholder:text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'
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
				<Button className='bg-white dark:bg-[#212121] rounded-full px-5 py-8'>
					<SendHorizonal
						className={cn(
							"h-6 w-6 text-neutral-400 transition",
							form.getValues("content").length >= 1 && "text-primary"
						)}
					/>
				</Button>
			</form>
		</Form>
	);
};
