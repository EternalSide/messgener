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
import axios from "axios";
import {Button} from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {editProfileSchema} from "@/lib/validation";

const EditProfileModal = () => {
	const {isOpen, onClose, type, data} = useModal();
	const isModalOpen = isOpen && type === "editProfile";
	const router = useRouter();
	const form = useForm({
		resolver: zodResolver(editProfileSchema),
		defaultValues: {
			name: data?.user?.name || "",
			username: data?.user?.username || "",
		},
	});

	useEffect(() => {
		if (data?.user) {
			form.setValue("name", data.user.name);
			form.setValue("username", data.user.username);
		}
	}, [form, data?.user]);

	const onSubmit = async (values: z.infer<typeof editProfileSchema>) => {
		try {
			await axios.patch(`/api/user/${data?.user?.id}`, values);

			form.reset();
			router.refresh();
			onClose();
		} catch (error) {
			console.log(error);
		}
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
			<DialogContent className='p-0 overflow-hidden bg-white dark:bg-[#212121]'>
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
						<div className='space-y-6 px-6'>
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
												className='dark:bg-neutral-900 bg-neutral-200/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
												placeholder='Введите ваше имя'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='username'
								render={({field}) => (
									<FormItem>
										<FormLabel className='uppercase text-xs font-bold'>
											Имя пользователя
										</FormLabel>
										<FormControl>
											<Input
												disabled={false}
												className='dark:bg-neutral-900 bg-neutral-200/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
												placeholder='Введите ваше имя пользователя'
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
								disabled={form.formState.isLoading}
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
