import {getCurrentUser} from "@/lib/actions/user.action";
import {db} from "@/lib/db";
import {NextResponse} from "next/server";

interface IParams {
	conversationId?: string;
}

export async function DELETE(request: Request, {params}: {params: IParams}) {
	try {
		const {conversationId} = params;
		const currentUser = await getCurrentUser();

		if (!currentUser?.id)
			return new NextResponse("Вы не авторизованы", {status: 400});

		const existingConversation = await db.conversation.findUnique({
			where: {
				id: conversationId,
			},
			include: {
				userOne: true,
				userTwo: true,
			},
		});

		if (!existingConversation)
			return new NextResponse("Диалога не существует", {status: 400});

		const deletedConversation = await db.conversation.deleteMany({
			where: {
				id: conversationId,
				userOneId: existingConversation.userOneId,
				userTwoId: existingConversation.userTwoId,
			},
		});

		return NextResponse.json(deletedConversation);
	} catch (error: any) {
		console.log(error, "ERROR_CONVERSATION_DELETE");
		return new NextResponse("Internal Error", {status: 500});
	}
}
