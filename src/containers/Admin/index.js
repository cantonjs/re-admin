import React, { Component } from 'react';
import { polyfill } from 'react-lifecycles-compat';
import PropTypes from 'prop-types';
import { getAppConfig, configShape } from './utils';
import moment from 'moment';
import LocaleStores from 'stores/LocaleStores';
import AdminContext from 'containers/AdminContext';
import { LocaleProvider } from 'antd';
import 'moment/locale/zh-cn';

// TODO: should be able to custom
moment.locale('zh-cn');

@polyfill
export default class Admin extends Component {
	static propTypes = {
		...configShape,
		config: PropTypes.shape(configShape),
		children: PropTypes.node,
	};

	static getDerivedStateFromProps(nextProps) {
		return { config: getAppConfig(nextProps) };
	}

	constructor(props) {
		super(props);

		const config = getAppConfig(props);
		const { locale } = config;
		if (locale) LocaleStores.setLocale(locale);
		this.state = { config };
	}

	_renderContext() {
		return <AdminContext appConfig={this.state.config} />;
	}

	render() {
		const { locale } = this.state.config;
		if (locale) {
			return (
				<LocaleProvider locale={locale.antd}>
					{this._renderContext()}
				</LocaleProvider>
			);
		} else {
			return this._renderContext();
		}
	}
}
