"use client";
import {cn} from "@/lib/utils";
import {useEffect, useState} from "react";
import {Edit, Trash} from "lucide-react";
import ActionTooltip from "../shared/ActionTooltip";
import axios from "axios";
import {useForm} from "react-hook-form";
import {messageSchema} from "@/lib/validation";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem} from "../ui/form";
import {Input} from "../ui/input";
import {Button} from "../ui/button";
import qs from "query-string";

interface Props {
	content: string;
	createdAt: string;
	isOwnMessage: boolean;
	chatId: string;
	messageId: string;
}

export const ChatItem = ({
	content,
	isOwnMessage,
	createdAt,
	chatId,
	messageId,
}: Props) => {
	const [isEditing, setIsEditing] = useState(false);
	const form = useForm<z.infer<typeof messageSchema>>({
		resolver: zodResolver(messageSchema),
		defaultValues: {
			content: content,
		},
	});
	let canEditMessage = true;

	const isLoading = form.formState.isSubmitting;

	const deleteMessage = async () => {
		try {
			await axios.delete(`/api/socket/direct-messages/${chatId}`, {
				data: {directMessageId: messageId, chatId},
			});
		} catch (e) {
			console.log(e);
		}
	};

	const onSubmit = async (values: z.infer<typeof messageSchema>) => {
		try {
			await axios.patch(`/api/socket/direct-messages/${chatId}`, {
				data: {directMessageId: messageId, chatId},
				values: values,
			});

			form.reset();
			setIsEditing(false);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		form.reset({
			content: content,
		});
	}, [content]);

	return (
		<div
			className={cn(
				"relative group flex items-center  p-4 py-1  transition w-fit rounded-3xl",
				isOwnMessage
					? "ml-auto bg-[#eeffde] dark:bg-primary"
					: "mr-auto  bg-light dark:bg-dark"
			)}
		>
			<div className='flex flex-col w-full'>
				{!isEditing && (
					<>
						<p className='text-base text-zinc-600 dark:text-zinc-300 pr-10 '>
							{content}
						</p>
						<p className='text-xs dark:text-neutral-200 ml-auto '>
							{createdAt}
						</p>
					</>
				)}
			</div>
			{isEditing && (
				<Form {...form}>
					<form
						className='flex items-start w-full gap-x-2 pt-2'
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							name='content'
							render={({field}) => (
								<FormItem>
									<FormControl>
										<Input
											disabled={isLoading}
											className='border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'
											placeholder='Edited message'
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<Button
							disabled={isLoading}
							size='sm'
						>
							Сохранить
						</Button>
					</form>
					<span className='text-[10px] mt-1 text-zinc-400'>
						Нажмите escape, если хотите отменить.
					</span>
				</Form>
			)}
			<div className='hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-3 -right-1 z-10 bg-white dark:bg-zinc-800 border rounded-sm'>
				{isOwnMessage && (
					<ActionTooltip label='Изменить'>
						<Edit
							onClick={() => setIsEditing(true)}
							className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition'
						/>
					</ActionTooltip>
				)}
				<ActionTooltip label='Удалить'>
					<Trash
						onClick={deleteMessage}
						className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition'
					/>
				</ActionTooltip>
			</div>
		</div>
	);
};
