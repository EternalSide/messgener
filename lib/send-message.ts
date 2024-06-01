import {Conversation} from "@prisma/client";
import {createNewConversation} from "./actions/conversation.action";
import axios from "axios";
import qs from "query-string";

interface Props {
	conversationId: string | null | undefined;
	message: string;
	userOneId: string;
	userTwoId: string;
}

const sendMessageToTheUser = async ({
	conversationId,
	message,
	userOneId,
	userTwoId,
}: Props) => {
	const settings: {
		isFirstMessage: boolean;
		initialConversation: null | Conversation;
		initialConversationLocal: null | Conversation;
	} = {
		isFirstMessage: conversationId === null,
		initialConversation: null,
		initialConversationLocal: null,
	};

	try {
		if (settings.isFirstMessage) {
			settings.initialConversation = await createNewConversation(
				userOneId,
				userTwoId
			);
		}

		const url = qs.stringifyUrl({
			url: "/api/socket/direct-messages",
			query: {
				conversationId: settings.isFirstMessage
					? settings.initialConversation?.id!
					: conversationId,
			},
		});

		await axios.post(url, {content: message});

		return settings.isFirstMessage;
	} catch (e) {
		console.log(e);
	}
};
export default sendMessageToTheUser;
