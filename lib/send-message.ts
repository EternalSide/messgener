import {createNewChat} from "./actions/chat.action";
import axios from "axios";
import qs from "query-string";
import {SendMessageDataType, SendMessageToTheUser} from "@/types";

const sendMessageToTheUser = async (params: SendMessageToTheUser) => {
	const {chatId, content, userOneId, userTwoId} = params;

	const data: SendMessageDataType = {
		isFirstMessage: chatId === null,
		conversation: null,
	};

	try {
		if (data.isFirstMessage) {
			data.conversation = await createNewChat(userOneId, userTwoId);
		}

		const url = qs.stringifyUrl({
			url: "/api/socket/direct-messages",
			query: {
				chatId: data.isFirstMessage ? data.conversation?.id! : chatId,
			},
		});

		await axios.post(url, {content});

		return data.isFirstMessage;
	} catch (e) {
		console.log(e);
	}
};
export default sendMessageToTheUser;
