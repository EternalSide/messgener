import Image from "next/image";
import Link from "next/link";

interface Props {
	authorName: string;
	authorPic: string | null;
	authorUsername: string;
	lastMessage: string;
	lastMessageTime: string;
	variant: "chat" | "user";
}

const ChatCard = ({
	authorName,
	authorPic,
	authorUsername,
	lastMessage,
	lastMessageTime,
	variant,
}: Props) => {
	return (
		<Link
			href={`/chat/${authorUsername}`}
			className='px-3 py-3 rounded-lg flex items-center hover:bg-neutral-800 transition border-b'
		>
			<div className='flex items-center gap-2.5 w-full'>
				<div className='h-14 min-w-14 relative '>
					<Image
						className='rounded-full object-top'
						fill
						alt={authorName}
						src={authorPic || "NO_IMAGE"}
					/>
				</div>
				<div className='w-full'>
					<div className='flex items-start justify-between'>
						<h3 className='font-semibold'>{authorName}</h3>
						{variant === "chat" && (
							<p className='text-xs text-neutral-400'>{lastMessageTime}</p>
						)}
					</div>
					{variant === "chat" && (
						<p className='font-normal mt-1'>{lastMessage}</p>
					)}
					{variant === "user" && (
						<p className='font-normal mt-1 text-neutral-400'>
							@${authorUsername}
						</p>
					)}
				</div>
			</div>
		</Link>
	);
};
export default ChatCard;
