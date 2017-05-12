
import PropTypes from 'prop-types';

export default function withAppConfig(key) {
	return (TargetComponent) => {
		TargetComponent.contextTypes = Object.assign(
			(TargetComponent.contextTypes || {}),
			{ appConfig: PropTypes.object.isRequired },
		);

		TargetComponent.prototype.getAppConfig = function getAppConfig(childKey) {
			return this.props[childKey] || this.context.appConfig[key][childKey];
		};

		return TargetComponent;
	};

};
