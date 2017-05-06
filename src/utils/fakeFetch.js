
const fakeData = [];

for (let i = 0; i < 460; i++) {
	fakeData.push({
		key: i,
		name: `User ${i}`,
		score: 80,
		desc: `I am User no. ${i}`,
		touxiang: 'http://baidu.com'
	});
}

export default async function fakeFetch() {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(fakeData);
		}, 1000);
	});
}
