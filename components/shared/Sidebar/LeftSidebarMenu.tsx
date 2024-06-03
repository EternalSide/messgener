"use client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Switch} from "@/components/ui/switch";
import {
	ArrowLeft,
	LogOut,
	Menu,
	MessageCircleIcon,
	Moon,
	Settings,
	Star,
	Users,
} from "lucide-react";
import {SignOutButton} from "@clerk/nextjs";
import {useTheme} from "next-themes";
import {useRouter} from "next/navigation";
import {useModal} from "@/hooks/useModalStore";
import {SideBarVariant} from "@/types";
import {User} from "@prisma/client";
import {SetStateAction} from "react";

interface Props {
	currentUser: User;
	setSidebarVariant: React.Dispatch<SetStateAction<SideBarVariant>>;
	sidebarVariant: SideBarVariant;
}

const LeftSidebarMenu = ({
	currentUser,
	setSidebarVariant,
	sidebarVariant,
}: Props) => {
	const {theme, setTheme} = useTheme();
	const isDarkTheme = theme === "dark";
	const router = useRouter();
	const {onOpen} = useModal();

	if (sidebarVariant !== "chats") {
		return (
			<button
				className='dark:hover:bg-neutral-700/50 hover:bg-neutral-200/50 transition p-2 rounded-full flex items-center justify-center'
				onClick={() => setSidebarVariant("chats")}
			>
				<ArrowLeft className='h-6 w-6 text-neutral-400' />
			</button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className='dark:hover:bg-neutral-700/50 hover:bg-neutral-200/50 transition p-2 rounded-full flex items-center justify-center'>
				<Menu className='h-6 w-6 text-neutral-400' />
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-[270px] px-1.5 py-2 bg-[#fdfdfd] dark:bg-[#242424] opacity-[99%] ml-4 rounded-lg'>
				<DropdownMenuItem
					onClick={() => router.push(`/`)}
					className='flex items-center gap-4'
				>
					<MessageCircleIcon className='h-5 w-5 text-neutral-400' /> Чаты
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setSidebarVariant("users")}
					className='flex items-center gap-4'
				>
					<Users className='h-5 w-5 text-neutral-400' /> Пользователи
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => router.push(`/chat/${currentUser.username}`)}
					className='flex items-center gap-4'
				>
					<Star className='h-5 w-5 text-neutral-400' /> Избранное
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={(e) => {
						e.preventDefault();
						setTheme(isDarkTheme ? "light" : "dark");
					}}
					className='flex items-center justify-between'
				>
					<div className='flex items-center gap-4'>
						<Moon className='h-5 w-5 text-neutral-400' />
						<label
							className='cursor-pointer'
							htmlFor='darkmode-mode'
						>
							Ночная тема
						</label>
					</div>
					<Switch
						checked={isDarkTheme ? true : false}
						id='dark-mode'
					/>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => onOpen("editProfile", {user: currentUser})}
				>
					<div className='flex items-center gap-4'>
						<Settings className='h-5 w-5 text-neutral-400' /> Настройки
					</div>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={(e) => e.preventDefault()}>
					<SignOutButton>
						<div className='flex items-center gap-4 w-full'>
							<LogOut className='h-5 w-5 text-neutral-400' /> Выйти
						</div>
					</SignOutButton>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
export default LeftSidebarMenu;
