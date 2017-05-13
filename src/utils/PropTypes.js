
import PropTypes from 'prop-types';

export default {
	...PropTypes,
	component: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func,
	]),
	stringOrNumber: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
};
