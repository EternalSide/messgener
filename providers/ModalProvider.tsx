"use client";
import EditProfileModal from "@/components/modals/EditProfileModal";
import UserPictureModal from "@/components/modals/UserPictureModal";
import {useEffect, useState} from "react";

export const ModalProvider = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	return (
		<>
			<EditProfileModal />
			<UserPictureModal />
		</>
	);
};
