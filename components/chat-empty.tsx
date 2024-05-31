import Image from "next/image";

interface Props {
	src: string;
	h1: string;
	h3: string;
}

const ChatEmpty = ({src, h1, h3}: Props) => {
	return (
		<div className='flex items-center justify-center h-full'>
			<div className='bg-[#0f0f0f] opacity-95 shadow-md rounded-2xl p-6 text-center flex items-center flex-col justify-center'>
				<h1 className='font-semibold text-xl text-white'>{h1}</h1>
				<h3 className='font-normal text-sm text-white'>{h3}</h3>
				<div className='relative h-40 w-full mt-3'>
					<Image
						src={src}
						alt='no_chat_selected_image'
						fill
						className='object-cover rounded-xl'
					/>
				</div>
			</div>
		</div>
	);
};
export default ChatEmpty;
