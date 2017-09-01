
import PropTypes from 'prop-types';

const warned = {};

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
	stringOrObject: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.object,
	]),
	boolOrObject: PropTypes.oneOfType([
		PropTypes.bool,
		PropTypes.object,
	]),
	deprecated: function deprecatedProp(propType, explanation) {
		return function validate(props, propName, componentName, ...rest) {
			if (props[propName] != null) {

				// eslint-disable-next-line max-len
				const message = `"${propName}" property of "${componentName}" has been deprecated. ${explanation}`;

				if (!warned[message]) {
					warned[message] = true;
				}
			}

			return propType(props, propName, componentName, ...rest);
		};
	}
};
