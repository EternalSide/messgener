import {create} from "zustand";

export type ModalType = "editProfile";

interface ModalData {}

interface ModalStore {
	type: ModalType | null;
	data: any;
	isOpen: boolean;
	onOpen: (type: ModalType, data?: ModalData) => void;
	onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
	type: null,
	data: {},
	isOpen: false,
	onOpen: (type, data = {}) => set({isOpen: true, type: type, data: data}),
	onClose: () => set({isOpen: false, type: null}),
}));
