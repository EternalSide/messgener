"use client";
import {ModalStore, useModal} from "@/hooks/useModalStore";
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
import {useState} from "react";
import {createChannelSchema} from "@/lib/validation";
import {SingleImageDropzone} from "../shared/SingleImageDropzone";
import {MotionDiv} from "../shared/MotionDiv";
import {sidebarAnimations} from "@/constants";
import {useRouter} from "next/navigation";
import {createChannel} from "@/lib/actions/channel.action";

const CreateChannelModal = () => {
	const {isOpen, onClose, type}: ModalStore = useModal();
	const isModalOpen = isOpen && type === "createChannel";
	const [error, setError] = useState("");
	const [channelPicture, setChannelPicture] = useState<File | undefined>(
		undefined
	);
	// const {edgestore} = useEdgeStore();
	const router = useRouter();

	const form = useForm({
		resolver: zodResolver(createChannelSchema),
		defaultValues: {
			name: "",
			description: "",
		},
	});

	const handleClose = () => {
		form.reset();
		onClose();
	};

	const onSubmit = async (values: z.infer<typeof createChannelSchema>) => {
		setError("");
		let channelPic;
		try {
			// Если обновили фон
			// if (channelPicture) {
			// 	const res = await edgestore.channelPicture.upload({
			// 		file: channelPicture,
			// 	});
			// 	console.log(res.url);
			// 	channelPic = res.url;
			// }
			console.log("ok");
			await createChannel({
				name: values.name,
				description: values.description,
				link: "main",
				picture:
					"https://i.pinimg.com/564x/bd/58/1b/bd581bd4b0284afa7c42d8cc78e6c8c8.jpg",
				type: "public",
			});

			handleClose();
			router.refresh();
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<Dialog
			open={isModalOpen}
			onOpenChange={handleClose}
		>
			<DialogContent className='p-0 overflow-hidden bg-light dark:bg-dark'>
				<DialogHeader className='pt-8 px-6'>
					<DialogTitle className='text-2xl text-center font-normal'>
						Создать канал
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-8 mt-2.5 px-6'
					>
						<MotionDiv
							className='space-y-5 '
							variants={sidebarAnimations}
							initial='hidden'
							animate='visible'
							exit='exit'
							transition={{duration: 0.3}}
						>
							<FormItem>
								<FormLabel className='uppercase text-xs font-bold'>
									изображение
								</FormLabel>
								<SingleImageDropzone
									width={150}
									height={150}
									value={channelPicture}
									onChange={(file) => setChannelPicture(file)}
								/>
							</FormItem>

							<FormField
								control={form.control}
								name='name'
								render={({field}) => (
									<FormItem>
										<FormLabel className='uppercase text-xs font-bold'>
											Название канала
										</FormLabel>
										<FormControl>
											<Input
												disabled={false}
												className='dark:bg-neutral-900 bg-neutral-200/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
												placeholder='Введите название канала'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='description'
								render={({field}) => (
									<FormItem>
										<FormLabel className='uppercase text-xs font-bold'>
											Описание (необязательно)
										</FormLabel>
										<FormControl>
											<Input
												disabled={false}
												className='dark:bg-neutral-900 bg-neutral-200/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
												placeholder='Введите описание канала'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* <FormField
								control={form.control}
								name='mobile'
								render={({field}) => (
									<FormItem className=''>
										<FormLabel className='uppercase text-xs font-bold'>
											Тип канала
										</FormLabel>
										<div className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow'>
											<FormControl>
												<Checkbox
													checked={true}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<div className='space-y-1 leading-none'>
												<FormLabel>Публичный</FormLabel>
												<FormDescription>
													Канал будет доступен в поиске, любой сможет
													подписаться.
												</FormDescription>
											</div>
										</div>
									</FormItem>
								)}
							/> */}
						</MotionDiv>

						<DialogFooter className='px-6 py-4'>
							<Button
								variant='default'
								disabled={form.formState.isSubmitting}
							>
								{form.formState.isSubmitting ? "Сохраняю.." : "Сохранить"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateChannelModal;
