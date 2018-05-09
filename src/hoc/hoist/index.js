import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { forwardRef } from 'create-react-ref';

const isStatelessComponent = function isStatelessComponent(component) {
	return !('render' in component.prototype);
};

export default function hoist(WrappedComponent, options = {}) {
	const { displayName } = options;
	return function createHoistedComponent(TargetComponent) {
		let HoistedComponent = TargetComponent;
		if (
			!isStatelessComponent(TargetComponent) &&
			!isStatelessComponent(WrappedComponent)
		) {
			HoistedComponent = forwardRef((props, ref) => (
				<TargetComponent {...props} forwardedRef={ref} />
			));
			HoistedComponent.defaultProps = TargetComponent.defaultProps;
		}

		if (WrappedComponent) {
			HoistedComponent.WrappedComponent = WrappedComponent;
			hoistStatics(HoistedComponent, WrappedComponent);
		}
		if (displayName) {
			HoistedComponent.displayName = displayName;
		} else {
			const originalDisplayName =
				WrappedComponent.displayName || WrappedComponent.name;
			const finalName = `${HoistedComponent.name}(${originalDisplayName})`;
			HoistedComponent.displayName = finalName;
		}
		return HoistedComponent;
	};
}

export const extractRef = function extractRef(props) {
	const { forwardedRef, ...other } = props;
	return forwardedRef ? { ...other, ref: forwardedRef } : other;
};
