"use client";
import sendMessageToTheUser from "@/lib/send-message";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useQueryClient} from "@tanstack/react-query";
import {USER_WELCOME_MESSAGE} from "@/constants";

interface Props {
	src: string;
	h1: string;
	h3: string;
	chatId?: string | null;
	userOneId?: string;
	userTwoId?: string;
	variant?: "chat" | "home";
}

const ChatWelcome = ({
	src,
	h1,
	h3,
	chatId,
	userOneId,
	userTwoId,
	variant,
}: Props) => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const sendMessage = async () => {
		try {
			const isFirstMessage = await sendMessageToTheUser({
				chatId,
				content: USER_WELCOME_MESSAGE,
				userOneId: userOneId as string,
				userTwoId: userTwoId as string,
			});

			if (isFirstMessage) return router.refresh();
		} catch (e) {
			console.log(e);
		}
	};
	return (
		<div className='flex items-center justify-center h-full'>
			<div className='bg-[#0f0f0f] opacity-95 shadow-md rounded-2xl p-6 text-center flex items-center flex-col justify-center'>
				<h1 className='font-medium text-xl text-white'>{h1}</h1>
				<h3 className='font-normal text-base text-white mt-1.5'>{h3}</h3>

				<button
					onClick={variant === "chat" ? sendMessage : () => {}}
					className='relative h-48 w-full mt-1.5'
				>
					<Image
						src={src}
						alt='no_chat_selected_image'
						fill
						className='object-cover rounded-xl'
					/>
				</button>
			</div>
		</div>
	);
};
export default ChatWelcome;
