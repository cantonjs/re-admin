

const fakeData = [];
const total = 450;



for (let i = 0; i < total + 1; i++) {
	fakeData.push({
		key: i,
		name: `User ${i}`,
		score: 80,
		desc: `I am User no. ${i}`,
		touxiang: 'http://baidu.com'
	});
}

export default async function fakeFetch({ page = 0 }) {
	return new Promise((resolve) => {
		const start = (page - 1) * 20;
		const list = fakeData.slice(start, start + 19);
		const data = {
			list,
			total
		};
		setTimeout(() => {
			resolve(data);
		}, 1000);
	});
}
