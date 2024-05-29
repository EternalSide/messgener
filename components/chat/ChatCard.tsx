import Image from "next/image";
import Link from "next/link";

const ChatCard = () => {
	return (
		<Link
			href={"/"}
			className='px-3 py-3 rounded-lg flex items-center hover:bg-neutral-800 transition border-b'
		>
			<div className='flex items-center gap-2.5 w-full'>
				<div className='h-14 min-w-14 relative '>
					<Image
						className='rounded-full object-top'
						fill
						alt='user name'
						src={
							"https://i.pinimg.com/564x/a8/2f/bc/a82fbcc0c3ed77b1a740d3b0d213729d.jpg"
						}
					/>
				</div>
				<div className='w-full'>
					<div className='flex items-start justify-between'>
						<h3 className='font-semibold'> Tenderlybae*</h3>
						<p className='text-xs text-neutral-400'>10:33</p>
					</div>
					<p className='font-normal mt-1'>привввееет</p>
				</div>
			</div>
		</Link>
	);
};
export default ChatCard;
