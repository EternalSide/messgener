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
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useEffect, useState} from "react";
import {editProfileSchema} from "@/lib/validation";
import {updateUser} from "@/lib/actions/user.action";
import {SingleImageDropzone} from "../shared/SingleImageDropzone";
import {useEdgeStore} from "@/lib/edgestore";
import {MotionDiv} from "../shared/MotionDiv";
import {sidebarAnimations} from "@/constants";
import {FileText, Image} from "lucide-react";
import {cn} from "@/lib/utils";
import {useRouter} from "next/navigation";

const EditProfileModal = () => {
	const [variant, setVariant] = useState<"general" | "images">("general");
	const {isOpen, onClose, type, data}: ModalStore = useModal();
	const isModalOpen = isOpen && type === "editProfile";
	const [error, setError] = useState("");
	const [profilePicture, setProfilePicture] = useState<File | string>();
	const [backgroundPicture, setBackgroundPicture] = useState<File | string>();
	const {edgestore} = useEdgeStore();
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
			setProfilePicture(data.user?.profilePic || "");
			setBackgroundPicture(data.user?.backgroundPic || "");
		}
	}, [data?.user, isModalOpen]);

	const handleClose = () => {
		form.reset();
		onClose();
	};
	const onSubmit = async (values: z.infer<typeof editProfileSchema>) => {
		setError("");
		let profilePic = profilePicture ? profilePicture : "";
		let backgroundPic = backgroundPicture ? backgroundPicture : "";

		try {
			// Если обновили изображение
			if (typeof profilePic !== "string") {
				const res = await edgestore.userProfilePic.upload({
					file: profilePic,
					options: {
						replaceTargetUrl: data?.user?.profilePic,
					},
				});
				profilePic = res.url;
			}
			// Если обновили фон
			if (typeof backgroundPic !== "string") {
				const res = await edgestore.userChatBackground.upload({
					file: backgroundPic,
					options: {
						replaceTargetUrl: data?.user?.backgroundPic as string,
					},
				});
				backgroundPic = res.url;
			}

			const res = await updateUser({
				name: values.name,
				username: values.username,
				userId: data?.user?.id as string,
				profilePic,
				backgroundPic,
			});

			if ("message" in res) return setError((res as Error).message);

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
					<div className='flex items-center gap-3'>
						<button onClick={() => setVariant("general")}>
							<FileText
								className={cn(variant === "general" && "text-primary")}
							/>
						</button>
						<button onClick={() => setVariant("images")}>
							<Image className={cn(variant === "images" && "text-primary")} />
						</button>
					</div>
					<DialogTitle className='text-2xl text-center font-normal'>
						Редактировать профиль
					</DialogTitle>
					<div className='flex justify-center items-center'>
						<Button>Основное</Button>{" "}
						<Button className={variant === "images" ? "" : "!rounded-none"}>
							Оформление
						</Button>
					</div>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-8 mt-2.5'
					>
						<div className='px-6'>
							<MotionDiv
								key={variant}
								className='space-y-5 '
								variants={sidebarAnimations}
								initial='hidden'
								animate='visible'
								exit='exit'
								transition={{duration: 0.3}}
							>
								{variant === "images" && (
									<>
										<FormItem>
											<FormLabel className='uppercase text-xs font-bold'>
												Фото профиля
											</FormLabel>
											<SingleImageDropzone
												width={200}
												height={200}
												value={profilePicture}
												onChange={(file) => setProfilePicture(file)}
											/>
										</FormItem>
										<FormItem>
											<FormLabel className='uppercase text-xs font-bold'>
												Обложка для чатов
											</FormLabel>
											<SingleImageDropzone
												className='w-full'
												height={200}
												value={backgroundPicture}
												onChange={(file) => setBackgroundPicture(file)}
											/>
										</FormItem>
									</>
								)}
								{variant === "general" && (
									<>
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
									</>
								)}
							</MotionDiv>

							{error && (
								<div className='bg-red-500 rounded-md px-3 py-2'>{error}</div>
							)}
						</div>

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
export default EditProfileModal;
