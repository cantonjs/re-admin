import PropTypes from 'prop-types';
import { propTypes as MobxPropTypes } from 'mobx-react';
import warning from 'warning';

const warned = {};

export default {
	...PropTypes,
	component: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.string,
		PropTypes.func,
	]),
	array: PropTypes.oneOfType([PropTypes.array, MobxPropTypes.observableArray]),
	stringOrNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	stringOrObject: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	stringOrFunc: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
	nodeOrFunc: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
	render: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
	deprecated: function deprecatedProp(propType, explanation) {
		return function validate(props, propName, componentName, ...rest) {
			if (props[propName] != null) {
				// eslint-disable-next-line max-len
				let message = `"${propName}" property of "${componentName}" has been deprecated.`;
				if (explanation) message += ` ${explanation}`;

				if (!warned[message]) {
					warned[message] = true;
					warning(false, message);
				}
			}

			return propType(props, propName, componentName, ...rest);
		};
	},
};
