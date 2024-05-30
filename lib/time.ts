export function formatDate(inputDateStr: any): string {
	const inputDate = new Date(inputDateStr);

	// Определение локального времени
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const yesterday = new Date(today);
	yesterday.setDate(today.getDate() - 1);

	// Форматирование времени
	const options: Intl.DateTimeFormatOptions = {
		hour: "2-digit",
		minute: "2-digit",
	};

	if (inputDate >= today) {
		return inputDate.toLocaleTimeString("ru-RU", options);
	} else if (inputDate >= yesterday) {
		return `Вчера ${inputDate.toLocaleTimeString("ru-RU", options)}`;
	} else {
		const dateOptions: Intl.DateTimeFormatOptions = {
			day: "2-digit",
			month: "short",
		};
		return `${inputDate.toLocaleDateString(
			"ru-RU",
			dateOptions
		)} ${inputDate.toLocaleTimeString("ru-RU", options)}`;
	}
}
