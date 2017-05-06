
const fakeData = [
	{
		id: 1,
		name: 'JC',
	},
	{
		id: 2,
		name: 'Cap31',
	},
];

export default async function fakeFetch() {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(fakeData);
		}, 1000);
	});
}
