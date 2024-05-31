// Обновляет сообщения.

export const useUpdateMessages = (
	queryClient: any,
	conversationId: string | null,
	content: string
) => {
	const date = new Date();

	queryClient.setQueryData([`chat:${conversationId}`], (oldData: any) => {
		if (!oldData || !oldData.pages || oldData.pages.length === 0) {
			return {
				pages: [
					{
						items: [{content, isOwnMessage: true}],
					},
				],
			};
		}

		const newData = [...oldData.pages];

		newData[0] = {
			...newData[0],
			items: [
				{
					content,
					isOwnMessage: true,
					createdAt: date,
				},
				...newData[0].items,
			],
		};

		return {
			...oldData,
			pages: newData,
		};
	});
};
