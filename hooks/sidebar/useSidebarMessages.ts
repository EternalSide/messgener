import {useEffect} from "react";

// Обновляет чаты в сайдбаре
const useSidebarMessages = ({data}: any) => {
	let chats;
	useEffect(() => {
		chats = data?.sort((a: any, b: any) => {
			if (!a?.directMessages || !b?.directMessages) return b - a;
			const lastMessagea = a.directMessages[a.directMessages.length - 1];
			const lastMessageb = b.directMessages[b.directMessages.length - 1];
			if (!lastMessagea || !lastMessageb) return [];
			const at = lastMessagea.createdAt;
			const bt = lastMessageb.createdAt;
			return new Date(bt).getTime() - new Date(at).getTime();
		});
	}, []);
	return chats;
};
export default useSidebarMessages;
