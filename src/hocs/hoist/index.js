import React from 'react';
import { forwardRef } from 'utils/reactPolyfill';
import hoistStatics from 'hoist-non-react-statics';

const notStatelessComponent = function notStatelessComponent(component) {
	return component && component.prototype && 'render' in component.prototype;
};

const getDisplayName = function getDisplayName(component) {
	return component.displayName || component.name;
};

export default function hoist(WrappedComponent, options = {}) {
	const { displayName } = options;
	return function createHoistedComponent(TargetComponent) {
		let HoistedComponent = TargetComponent;
		if (
			notStatelessComponent(TargetComponent) &&
			notStatelessComponent(WrappedComponent)
		) {
			HoistedComponent = forwardRef((props, ref) => (
				<TargetComponent {...props} forwardedRef={ref} />
			));
			HoistedComponent.displayName = getDisplayName(TargetComponent);
			HoistedComponent.defaultProps = TargetComponent.defaultProps;
		}

		if (WrappedComponent) {
			HoistedComponent.WrappedComponent = WrappedComponent;
			hoistStatics(HoistedComponent, WrappedComponent);
		}
		if (displayName) {
			HoistedComponent.displayName = displayName;
		} else {
			const originalDisplayName = getDisplayName(WrappedComponent);
			const prefix = getDisplayName(HoistedComponent);
			HoistedComponent.displayName = `${prefix}(${originalDisplayName})`;
		}
		return HoistedComponent;
	};
}

export const extractRef = function extractRef(props) {
	const { forwardedRef, ...other } = props;
	return forwardedRef ? { ...other, ref: forwardedRef } : other;
};
