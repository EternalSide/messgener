import LeftSidebar from "./_components/LeftSidebar/LeftSidebar";

const MainLayout = async ({children}: {children: React.ReactNode}) => {
	return (
		<div className='h-full'>
			<LeftSidebar />
			<div className='pl-[390px] w-full h-full chat'>{children}</div>
		</div>
	);
};
export default MainLayout;
