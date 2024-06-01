"use client";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {EmojiPicker} from "./EmojiPicker";
import {SendHorizonal} from "lucide-react";
import {Button} from "../ui/button";
import {messageSchema} from "@/lib/validation";
import {User} from "@prisma/client";
import {cn} from "@/lib/utils";
import {useRouter} from "next/navigation";
import sendMessageToTheUser from "@/lib/send-message";

interface ChatInputProps {
	users: User[];
	conversationId: string | null;
}

export const ChatInput = ({users, conversationId}: ChatInputProps) => {
	const router = useRouter();

	const form = useForm<z.infer<typeof messageSchema>>({
		resolver: zodResolver(messageSchema),
		defaultValues: {
			content: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof messageSchema>) => {
		form.reset();

		try {
			const isFirstMessage = await sendMessageToTheUser({
				conversationId,
				message: values.content,
				userOneId: users[0].id,
				userTwoId: users[1].id,
			});

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
								<div className='relative p-4 px-0 pr-2 w-full'>
									<Input
										className='px-12 text-base bg-light dark:bg-dark py-8 border-none placeholder:text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'
										placeholder={`Введите сообщение...`}
										{...field}
									/>
									<div className='absolute top-9 left-4'>
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
				<Button className='bg-light dark:bg-dark rounded-full px-5 py-8'>
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
