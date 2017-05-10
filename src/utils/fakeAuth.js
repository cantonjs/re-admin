
export default async function fakeAuth({ accessToken }) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (accessToken === 'paiBei4uChua8Aipooc9joeS') {
				resolve({
					accessToken: 'paiBei4uChua8Aipooc9joeS',
					expiresIn: 86400,
				});
			}
			else {
				reject(new Error('Invalid `accessToken`'));
			}
		}, 1000);
	});
}
