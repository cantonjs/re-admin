import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { observer } from 'mobx-react';
import warning from 'warning';
import localeStore from 'stores/localeStore';

export default function localize(options = {}) {
	const {
		defaultProps,
		localeAttrName = 'locale',
		component: localeComponent,
	} = options;
	return function createLocalizedComponent(WrappedComponent) {
		const {
			displayName,
			getSchemaDefaultProps: originalGetSchemaDefaultProps,
		} = WrappedComponent;
		const localeComponentName = localeComponent || displayName;
		const store = localeStore[localeComponentName];
		const hasLocale = !!store;

		if (hasLocale) {
			const locale = Object.keys(store).reduce((acc, key) => {
				return Object.defineProperty(acc, key, {
					enumerable: true,
					get() {
						return localeStore[localeComponentName][key];
					},
				});
			}, {});
			WrappedComponent.prototype[localeAttrName] = locale;
		} else {
			warning(false, `locale component "${localeComponentName}" not found`);
		}

		const getDefaultLocaleProps = function getDefaultLocaleProps() {
			if (!hasLocale || !defaultProps) {
				return {};
			}
			return Object.keys(defaultProps).reduce((acc, prop) => {
				const key = defaultProps[prop];
				acc[prop] = localeStore[localeComponentName][key];
				return acc;
			}, {});
		};

		@observer
		class LocaleComponent extends Component {
			static getSchemaDefaultProps = function getSchemaDefaultProps() {
				const localeProps = getDefaultLocaleProps();
				return originalGetSchemaDefaultProps ?
					{
						...originalGetSchemaDefaultProps(),
						...localeProps,
					} :
					localeProps;
			};

			static defaultProps = WrappedComponent.defaultProps;

			render() {
				return (
					<WrappedComponent {...getDefaultLocaleProps()} {...this.props} />
				);
			}
		}

		return hoistStatics(LocaleComponent, WrappedComponent);
	};
}
