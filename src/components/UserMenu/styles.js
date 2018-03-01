import { extendable, flexCenter } from 'utils/Styles';

export default {
	container: extendable({
		...flexCenter,
		margin: '0 8px',
		cursor: 'pointer',
	}),
	text: {
		margin: '0 8px',
		userSelect: 'none',
	},
};
