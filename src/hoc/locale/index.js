import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { observer } from 'mobx-react';
import warning from 'warning';
import localeStore from 'stores/localeStore';

export default function createLocaleHoc(options = {}) {
	const { defaultProps = {}, localeAttrName = 'locale' } = options;
	return function localeHoc(WrappedComponent) {
		const { name } = WrappedComponent;
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

		@observer
		class LocaleComponent extends Component {
			_getLocaleProps() {
				return Object.keys(defaultProps).reduce((acc, prop) => {
					const key = defaultProps[prop];
					acc[prop] = localeStore[name][key];
					return acc;
				}, {});
			}

			render() {
				const { props } = this;
				const localeProps = hasLocale ? this._getLocaleProps() : {};
				return <WrappedComponent {...localeProps} {...props} />;
			}
		}

		return hoistStatics(LocaleComponent, WrappedComponent);
	};
}
