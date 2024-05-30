import {createProfile} from "@/lib/actions/user.action";
import LeftSidebar from "./_components/LeftSidebar/LeftSidebar";

const MainLayout = async ({children}: {children: React.ReactNode}) => {
	await createProfile();

	return (
		<div className='h-full'>
			<div className='max-lg:hidden'>
				<LeftSidebar />
			</div>
			<div className='max-lg:pl-0 pl-[390px] w-full h-full chat'>
				{children}
			</div>
		</div>
	);
};
export default MainLayout;
