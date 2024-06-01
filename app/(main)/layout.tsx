import {createProfile} from "@/lib/actions/user.action";
import LeftSidebar from "../../components/shared/Sidebar/LeftSidebar";
import {cn} from "@/lib/utils";

const MainLayout = async ({children}: {children: React.ReactNode}) => {
	const currentUser = await createProfile();

	let styles = {
		backgroundImage: currentUser?.chatBackground
			? `url("${currentUser.chatBackground}")`
			: "",
		backgroundRepeat: "no-repeat",
		backgroundSize: "cover",
		backgroundPosition: "center",
	};

	return (
		<div className='h-full'>
			<div className='max-lg:hidden'>
				<LeftSidebar />
			</div>
			<div
				style={styles}
				className={cn(
					"max-lg:pl-0 pl-[390px] w-full h-full",
					!currentUser?.chatBackground && "bg-[#DCF8C6] dark:bg-zinc-900"
				)}
			>
				{children}
			</div>
		</div>
	);
};
export default MainLayout;
