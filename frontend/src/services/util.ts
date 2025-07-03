export const responseOkay = async (res: Response) => {
	if (!res.ok) {
		const errorData = await res.json();
		throw new Error(errorData.detail || `HTTP ${res.status}`);
	}
};
