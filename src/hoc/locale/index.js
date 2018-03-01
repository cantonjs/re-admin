import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { observer } from 'mobx-react';
import warning from 'warning';
import localeStore from 'stores/localeStore';

export default function createLocaleHoc(options = {}) {
	const { defaultProps, localeAttrName = 'locale' } = options;
	return function localeHoc(WrappedComponent) {
		const {
			name,
			getSchemaDefaultProps: originalGetSchemaDefaultProps,
		} = WrappedComponent;
		const store = localeStore[name];
		const hasLocale = !!store;

		if (hasLocale) {
			const locale = Object.keys(store).reduce((acc, key) => {
				return Object.defineProperty(acc, key, {
					enumerable: true,
					get() {
						return localeStore[name][key];
					},
				});
			}, {});
			WrappedComponent.prototype[localeAttrName] = locale;
		} else {
			warning(false, `locale component "${name}" not found`);
		}

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
