import { flexCenter } from 'utils/Styles';

const margin = 16;

export default {
	container: {
		minWidth: 1024,
		minHeight: '100vh',
	},
	spinContainer: {
		minHeight: '100vh',
		display: 'block',
		textAlign: 'center',
		padding: 80,
	},
	header: {
		background: '#fff',
		padding: 0,
		display: 'flex',
		justifyContent: 'space-between',
	},
	headerLeft: {
		...flexCenter,
		marginLeft: margin,
	},
	headerRight: {
		...flexCenter,
		marginRight: margin,
		paddingRight: margin,
	},
	content: {
		margin,
	},
	breadcrumb: {
		// marginBottom: margin,
	},
	contentBody: {
		padding: 24,
		background: '#fff',
		minHeight: 360,
	},
	footer: {
		textAlign: 'center',
	},
};
