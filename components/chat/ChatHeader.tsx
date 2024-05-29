import Image from "next/image";
import {SocketIndicator} from "../socket-indicator";
import {Settings} from "lucide-react";

interface Props {
	authorName: string;
	authorPic: string | null;
	authorUsername: string;
}

const ChatHeader = ({authorName, authorPic, authorUsername}: Props) => {
	return (
		<div className='w-full bg-[#212121] min-h-[56px] py-1.5 px-5 flex items-center justify-between'>
			<div className='flex items-center gap-2.5 w-full'>
				<div className='h-12 min-w-12 relative '>
					<Image
						className='rounded-full object-top'
						fill
						alt={authorName}
						src={authorPic || "NO_PIC"}
					/>
				</div>
				<div>
					<h3 className='font-semibold'>{authorName}</h3>
					<p className='text-xs text-neutral-400'>был(а) недавно</p>
				</div>
			</div>
			<div className='flex items-center gap-3'>
				<SocketIndicator />
				<button>
					<Settings className='h-6 w-6 text-neutral-400' />
				</button>
			</div>
		</div>
	);
};
export default ChatHeader;
