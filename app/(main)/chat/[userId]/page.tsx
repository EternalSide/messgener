import ChatHeader from "@/components/chat/ChatHeader";
import {getCurrentUser} from "@/lib/current-user";
import {db} from "@/lib/db";
import {redirect} from "next/navigation";

const ChatWithUser = async ({params}: {params: {userId: string}}) => {
	const currentUser = await getCurrentUser();
	const user = await db.user.findUnique({
		where: {
			id: params.userId,
		},
	});
	if (!user) return redirect("/");

	const isOwnChat = params.userId === currentUser?.id;

	return (
		<div>
			<ChatHeader
				authorName={isOwnChat ? "Избранное" : currentUser.name}
				authorPic={
					"https://i.pinimg.com/736x/fb/77/01/fb77018d77242ed8987ad1a8356139ee.jpg"
				}
				authorUsername={currentUser.id}
			/>
			<div className='max-w-[720px] w-full mx-auto'>chat with user</div>
		</div>
	);
};
export default ChatWithUser;
