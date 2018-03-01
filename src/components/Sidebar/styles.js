import { flexCenter } from 'utils/Styles';

export default {
	container: {
		overflow: 'auto',
		height: '100vh',
		position: 'fixed',
		left: 0,
	},
	title: {
		...flexCenter,
		height: 64,
		backgroundColor: '#002140',
		color: '#fff',
	},
	link: {
		display: 'inline',
		color: 'inherit',
		textDecoration: 'none',
	},
};
