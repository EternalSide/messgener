"use client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Switch} from "@/components/ui/switch";
import {LogOut, Menu, Moon, Star, Users} from "lucide-react";

const LeftSidebarMenu = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<button className='hover:bg-neutral-700/50 transition p-2 rounded-full flex items-center justify-center'>
					<Menu className='h-6 w-6 text-neutral-400' />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-[270px] px-1.5 py-2 bg-[#242424] opacity-[99%] ml-4 rounded-lg'>
				<DropdownMenuItem className='flex items-center gap-4'>
					<Star className='h-5 w-5 text-neutral-400' /> Избранное
				</DropdownMenuItem>
				<DropdownMenuItem className='flex items-center gap-4'>
					<Users className='h-5 w-5 text-neutral-400' /> Пользователи
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={(e) => e.preventDefault()}
					className='flex items-center justify-between'
				>
					<div className='flex items-center gap-4'>
						<Moon className='h-5 w-5 text-neutral-400' />
						<label htmlFor='darkmode-mode'>Ночная тема</label>
					</div>
					<Switch
						checked={true}
						id='dark-mode'
					/>
				</DropdownMenuItem>
				<DropdownMenuItem className='flex items-center gap-4'>
					<LogOut className='h-5 w-5 text-neutral-400' /> Выйти
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
export default LeftSidebarMenu;
