import React, { Component } from 'react';
import { observer } from 'mobx-react';
import warning from 'warning';
import localeStore from 'stores/localeStore';
import hoist, { extractRef } from 'hocs/hoist';

export default function localize(name, options = {}) {
	const { defaultProps, prop = 'localeStore' } = options;
	return function createLocalizedComponent(WrappedComponent) {
		const store = localeStore[name];
		const storeProps = {};
		const hasLocale = !!store;
		warning(store, `locale component "${name}" not found`);
		if (store) storeProps[prop] = store;

		// if (hasLocale) {
		// 	const locale = Object.keys(store).reduce((acc, key) => {
		// 		return Object.defineProperty(acc, key, {
		// 			enumerable: true,
		// 			get() {
		// 				return localeStore[name][key];
		// 			},
		// 		});
		// 	}, {});
		// 	WrappedComponent.prototype[localeAttrName] = locale;
		// } else {
		// 	warning(false, `locale component "${name}" not found`);
		// }

		const getDefaultLocaleProps = function getDefaultLocaleProps() {
			if (!hasLocale || !defaultProps) {
				return {};
			}
			return Object.keys(defaultProps).reduce((acc, prop) => {
				const key = defaultProps[prop];
				acc[prop] = localeStore[name][key];
				return acc;
			}, {});
		};

		@hoist(WrappedComponent)
		@observer
		class Locale extends Component {
			static defaultProps = WrappedComponent.defaultProps;

			render() {
				return (
					<WrappedComponent
						{...getDefaultLocaleProps()}
						{...extractRef(this.props)}
						{...storeProps}
					/>
				);
			}
		}

		return Locale;
	};
}
