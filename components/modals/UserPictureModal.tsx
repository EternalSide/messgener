"use client";
import {useModal} from "@/hooks/useModalStore";
import {Dialog, DialogContent} from "@/components/ui/dialog";
import Image from "next/image";
import {NO_USER_IMAGE} from "@/constants";

const UserPictureModal = () => {
	const {isOpen, onClose, type, data} = useModal();
	const isModalOpen = isOpen && type === "userProfilePicture";

	return (
		<Dialog
			open={isModalOpen}
			onOpenChange={onClose}
		>
			<DialogContent className='p-0 overflow-hidden'>
				<div className='h-[55vh] w-full relative '>
					<Image
						fill
						alt={data?.name || ""}
						src={data?.imgSrc || NO_USER_IMAGE}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
};
export default UserPictureModal;
