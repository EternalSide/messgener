import {getCurrentUser} from "@/lib/current-user";
import {db} from "@/lib/db";
import {NextResponse} from "next/server";

export async function PATCH(
	req: Request,
	{params}: {params: {userId: string}}
) {
	try {
		const profile = await getCurrentUser();

		const {name, username} = await req.json();

		const userId = params.userId;

		if (!profile || profile.id !== params.userId) {
			return new NextResponse("Unauthorized", {status: 401});
		}

		if (!params.userId) {
			return new NextResponse("user ID missing", {status: 400});
		}

		const user = await db.user.update({
			where: {
				id: profile.id,
			},
			data: {
				name,
				username,
			},
		});

		return NextResponse.json(user);
	} catch (error) {
		console.log("[USER_PATCH]", error);
		return new NextResponse("Internal Error", {status: 500});
	}
}
