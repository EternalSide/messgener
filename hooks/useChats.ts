import {create} from "zustand";

export type ModalType = "editProfile";

interface ChatsStore {
	userChats: any;
	setUserChats: (chats: any) => void;
}

export const useChats = create<ChatsStore>((set) => ({
	userChats: [],
	setUserChats: (chats) => {
		return set({userChats: chats});
	},
}));
