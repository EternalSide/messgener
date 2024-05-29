"use client";

import {useModal} from "@/hooks/useModalStore";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";

import {Button} from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useEffect} from "react";

const formSchema = z.object({
	name: z.string().min(2, {
		message: "name must be at least 2 characters.",
	}),
});

const EditProfileModal = () => {
	const {isOpen, onClose, type, data} = useModal();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: data?.user?.name || "",
		},
	});

	useEffect(() => {
		if (data?.user) {
			form.setValue("name", data.user.name);
		}
	}, [form, data?.user]);

	const isModalOpen = isOpen && type === "editProfile";
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		// try {
		// 	const url = qs.stringifyUrl({
		// 		url: `/api/channels/${channel?.id}`,
		// 		query: {
		// 			serverId: server?.id,
		// 		},
		// 	});
		// 	await axios.patch(url, values);
		// 	form.reset();
		// 	router.refresh();
		// 	onClose();
		// } catch (error) {
		// 	console.log(error);
		// }
	};

	const handleClose = () => {
		form.reset();
		onClose();
	};

	return (
		<Dialog
			open={isModalOpen}
			onOpenChange={handleClose}
		>
			<DialogContent className='p-0 overflow-hidden'>
				<DialogHeader className='pt-8 px-6'>
					<DialogTitle className='text-2xl text-center font-normal'>
						Редактировать профиль
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-8'
					>
						<div className='space-y-8 px-6'>
							<FormField
								control={form.control}
								name='name'
								render={({field}) => (
									<FormItem>
										<FormLabel className='uppercase text-xs font-bold'>
											Имя
										</FormLabel>
										<FormControl>
											<Input
												disabled={false}
												className='bg-neutral-900 border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
												placeholder='Введите ваше имя'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter className='px-6 py-4'>
							<Button
								variant='default'
								disabled={true}
							>
								Сохранить
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
export default EditProfileModal;
