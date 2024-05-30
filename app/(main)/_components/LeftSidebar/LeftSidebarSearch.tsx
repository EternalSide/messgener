import {Search} from "lucide-react";

const LeftSidebarSearch = () => {
	return (
		<div className='bg-neutral-200 dark:bg-[#2c2c2c] flex h-[45px] flex-1 items-center rounded-3xl px-4 w-full'>
			<Search className='h-6 w-6 text-neutral-400' />
			<input
				// value={searchValue}
				// onChange={(e) => {
				// 	setSearchValue(e.target.value);
				// 	if (!isOpen) setIsOpen(true);
				// 	if (e.target.value === "" && isOpen) {
				// 		setIsOpen(false);
				// 	}
				// }}
				type='text'
				placeholder=' Поиск'
				className='bg-transparent border-none shadow-none outline-none pl-1'
			/>
		</div>
	);
};
export default LeftSidebarSearch;
