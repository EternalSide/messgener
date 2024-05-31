import {createProfile} from "@/lib/actions/user.action";
import LeftSidebar from "./_components/LeftSidebar/LeftSidebar";

const MainLayout = async ({children}: {children: React.ReactNode}) => {
	const profile = await createProfile();

	return (
		<div className='h-full'>
			<div className='max-lg:hidden'>
				<LeftSidebar />
			</div>
			<div
				style={
					{
						// backgroundImage: `url("${profile.chatBackground}")`,
						// backgroundRepeat: "no-repeat",
						// backgroundSize: "cover",
						// backgroundPosition: "center",
					}
				}
				className='max-lg:pl-0 pl-[390px] w-full h-full bg-zinc-900'
			>
				{children}
			</div>
		</div>
	);
};
export default MainLayout;
