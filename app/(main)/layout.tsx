import {createProfile} from "@/lib/create-profile";
import LeftSidebar from "./_components/LeftSidebar/LeftSidebar";
import {db} from "@/lib/db";

const MainLayout = async ({children}: {children: React.ReactNode}) => {
	const currentUser = await createProfile();
	let allChats: unknown;
	const chats = await db.user.findUnique({
		where: {
			id: currentUser.id,
		},
		include: {
			conversationsInitiated: {
				include: {
					userTwo: true,
					directMessages: {
						select: {
							content: true,
							createdAt: true,
						},
					},
				},
			},
			conversationsReceived: {
				include: {
					userTwo: true,
					directMessages: {
						select: {
							content: true,
							createdAt: true,
						},
					},
				},
			},
		},
	});

	// work around around favourite model created for both relation
	if (
		chats?.conversationsInitiated.length ||
		chats?.conversationsReceived.length
	) {
		const c = [
			...chats?.conversationsInitiated,
			...chats?.conversationsReceived,
		];
		const uniqueChats = [];
		const seenIds = new Set();

		for (const chat of c) {
			if (!seenIds.has(chat.id)) {
				seenIds.add(chat.id);
				uniqueChats.push(chat);
			}
		}
		allChats = uniqueChats;
	} else {
		allChats = [];
	}

	return (
		<div className='h-full'>
			<LeftSidebar
				currentUser={currentUser}
				chats={allChats}
			/>
			<div className='pl-[390px] w-full h-full chat'>{children}</div>
		</div>
	);
};
export default MainLayout;
