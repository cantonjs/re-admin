import { flexCenter } from 'utils/Styles';

export default {
	container: {
		...flexCenter,
		flexDirection: 'column',
		height: '100%',
	},
	title: {
		margin: 10,
	},
	form: {
		maxWidth: 300,
		padding: 20,
		border: '1px solid #eee',
		marginTop: 10,
		width: '100%',
	},
};
