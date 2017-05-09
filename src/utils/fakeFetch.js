const fakeData = [];
const total = 450;

for (let i = 0; i < total; i++) {
	fakeData.push({
		id: i,
		name: `User ${i}`,
		score: 80,
		desc: `I am User no. ${i}`,
		touxiang: 'http://baidu.com'
	});
}


export default async function fakeFetch({ page, count }) {
	return new Promise((resolve) => {
		const start = (page - 1) * count;
		const list = fakeData.slice(start, start + count);
		const data = {
			list,
			total
		};
		setTimeout(() => {
			resolve(data);
		}, 1000);
	});
}
