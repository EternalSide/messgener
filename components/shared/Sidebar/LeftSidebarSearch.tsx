import {findUsers} from "@/lib/actions/user.action";
import {ChatWithUsersAndMessages, SideBarVariant} from "@/types";
import {User} from "@prisma/client";
import {useQueryClient} from "@tanstack/react-query";
import {Search} from "lucide-react";
import {useEffect, useState} from "react";

interface Props {
	sidebarVariant: SideBarVariant;
	currentUserId: string;
	isUsersLoading: boolean;
	isChatsLoading: boolean;
}

const LeftSidebarSearch = ({
	sidebarVariant,
	currentUserId,
	isUsersLoading,
	isChatsLoading,
}: Props) => {
	const queryClient = useQueryClient();
	const [searchValue, setSearchValue] = useState("");
	const [initialData, setInitialData] = useState<{chats: any; users: any}>({
		chats: null,
		users: null,
	});

	useEffect(() => {
		if (!isUsersLoading && !isChatsLoading) {
			setInitialData({
				users: queryClient.getQueryData(["users"]),
				chats: queryClient.getQueryData(["chats"]),
			});
			console.log("true");
		}
	}, [isUsersLoading, isChatsLoading]);

	useEffect(() => {
		const fetchSearchResults = async () => {
			if (sidebarVariant === "users") {
				const users: User[] = await findUsers({
					searchQuery:
						searchValue[0] === "@"
							? searchValue.slice(1).trim()
							: searchValue.trim(),
				});
				queryClient.setQueryData(["users"], () => users);
			}

			if (sidebarVariant === "chats") {
				const filteredChats = initialData.chats.filter(
					(chat: ChatWithUsersAndMessages) => {
						const otherUser =
							currentUserId === chat.userOneId ? chat.userTwo : chat.userOne;
						const value = searchValue.trim().toLowerCase();
						const searchCondition =
							otherUser.name.toLowerCase().includes(value) ||
							otherUser?.username.toLowerCase().includes(value);

						if (searchCondition) return chat;
					}
				);
				queryClient.setQueryData(["chats"], () => filteredChats);
			}
		};

		const debounced = setTimeout(() => {
			if (searchValue) {
				fetchSearchResults();
			}
		}, 300);

		return () => clearTimeout(debounced);
	}, [searchValue, setSearchValue]);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchValue(value);

		if (value === "" || value.length === 0) {
			if (sidebarVariant === "users") {
				queryClient.setQueryData(["users"], () => initialData.users);
			}
			if (sidebarVariant === "chats") {
				queryClient.setQueryData(["chats"], () => initialData.chats);
			}
		}
	};

	return (
		<div className='bg-neutral-200 dark:bg-[#2c2c2c] flex h-[45px] flex-1 items-center rounded-3xl px-4 w-full'>
			<Search className='h-6 w-6 text-neutral-400' />
			<input
				value={searchValue}
				onChange={onChange}
				type='text'
				placeholder='Поиск'
				className='bg-transparent border-none shadow-none outline-none pl-1'
			/>
		</div>
	);
};
export default LeftSidebarSearch;
