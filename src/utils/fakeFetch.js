

const list = [];
const total = 450;

const fakeData = {
	list,
	total
};

for (let i = 0; i < total + 1; i++) {
	list.push({
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
