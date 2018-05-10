import React, { Component } from 'react';
import { observer } from 'mobx-react';
import warning from 'warning';
import LocaleStores from 'stores/LocaleStores';
import hoist, { extractRef } from 'hocs/hoist';

export default function localize(name, options = {}) {
	const { prop = 'localeStore' } = options;
	return function createLocalizedComponent(WrappedComponent) {
		const hasLocale = LocaleStores.test(name);
		const storeProps = {};
		warning(hasLocale, `locale component "${name}" not found`);
		if (hasLocale) storeProps[prop] = LocaleStores.ensure(name);

		@hoist(WrappedComponent)
		@observer
		class Locale extends Component {
			render() {
				return <WrappedComponent {...extractRef(this.props)} {...storeProps} />;
			}
		}

		return Locale;
	};
}
