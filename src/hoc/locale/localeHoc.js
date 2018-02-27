import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { observer } from 'mobx-react';
import localeStore from 'stores/localeStore';
import LocaleProp from './LocaleProp';

export default function localeHoc(WrappedComponent) {
	const { defaultProps } = WrappedComponent;
	const descriptors = {};

	Object.keys(defaultProps).forEach((key) => {
		const defaultProp = defaultProps[key];
		if (defaultProp instanceof LocaleProp) {
			descriptors[key] = defaultProp;
		}
	});

	@observer
	class LocaleComponent extends Component {
		render() {
			const { props } = this;
			const localeProps = Object.keys(descriptors).reduce((acc, prop) => {
				const { name, key } = descriptors[prop];
				acc[prop] = localeStore[name][key];
				return acc;
			}, {});
			return <WrappedComponent {...localeProps} {...props} />;
		}
	}

	return hoistStatics(LocaleComponent, WrappedComponent);
}
