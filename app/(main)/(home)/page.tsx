import Image from "next/image";
import LeftSidebar from "../_components/LeftSidebar/LeftSidebar";
import {Settings} from "lucide-react";
import {SocketIndicator} from "@/components/socket-indicator";

export default function Home() {
	return (
		<main className='h-full'>
			<LeftSidebar />
			<div className='pl-[390px] w-full h-full chat'>
				<div className='w-full bg-[#212121] min-h-[56px] py-1.5 px-5 flex items-center justify-between'>
					<div className='flex items-center gap-2.5 w-full'>
						<div className='h-12 min-w-12 relative '>
							<Image
								className='rounded-full object-top'
								fill
								alt='user name'
								src={
									"https://i.pinimg.com/564x/a8/2f/bc/a82fbcc0c3ed77b1a740d3b0d213729d.jpg"
								}
							/>
						</div>
						<div>
							<h3 className='font-semibold'> Tenderlybae*</h3>
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
				<div className='max-w-[720px] w-full mx-auto'>chat</div>
			</div>
		</main>
	);
}
