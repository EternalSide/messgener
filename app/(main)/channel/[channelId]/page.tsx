import ChatHeader from "@/components/chat/ChatHeader";
import {ChatInput} from "@/components/chat/ChatInput";
import {getCurrentUser} from "@/lib/actions/user.action";
import {db} from "@/lib/db";
import {redirect} from "next/navigation";

const ChannelPage = async ({params}: {params: {channelId: string}}) => {
	const currentUser = await getCurrentUser();
	if (!currentUser) return redirect("/sign-in");

	const channel = await db.channel.findUnique({
		where: {
			link: params.channelId,
		},
	});

	if (!channel) return redirect("/");
	const isCreator = channel?.creatorId === currentUser.id;
	return (
		<div className='flex flex-col h-full'>
			<ChatHeader
				title={channel.name}
				picture={channel.picture}
				chatId={channel.id}
				type='channel'
				isCreator={isCreator}
			/>

			<div className='max-w-[700px] w-full mx-auto max-[1200px]:px-4 flex-1 flex flex-col overflow-y-auto'>
				<div className='flex-1' />

				{isCreator && (
					<ChatInput
						channel={{creatorId: currentUser.id, channelId: channel.id}}
						variant='channel'
					/>
				)}
			</div>
		</div>
	);
};
export default ChannelPage;
