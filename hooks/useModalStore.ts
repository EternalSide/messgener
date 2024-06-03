import {User} from "@prisma/client";
import {create} from "zustand";

type ModalType = "editProfile" | "userProfilePicture";

interface ModalData {
	imgSrc?: string;
	name?: string;
	user?: User;
}

export interface ModalStore {
	type: ModalType | null;
	data: ModalData;
	isOpen: boolean;
	onOpen: (type: ModalType, data?: ModalData) => void;
	onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
	type: null,
	data: {},
	isOpen: false,
	onOpen: (type, data) => set({isOpen: true, type: type, data: data}),
	onClose: () => set({isOpen: false, type: null}),
}));
