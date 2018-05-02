import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getAppConfig, configShape } from './utils';
import moment from 'moment';
import localeStore from 'stores/localeStore';
import AdminContext from 'containers/AdminContext';
import { LocaleProvider } from 'antd';
import 'moment/locale/zh-cn';

// TODO: should be able to custom
moment.locale('zh-cn');

export default class Admin extends Component {
	static propTypes = {
		...configShape,
		config: PropTypes.shape(configShape),
		children: PropTypes.node,
	};

	componentWillMount() {
		const { locale } = (this._config = getAppConfig(this.props));
		if (locale) localeStore.set(locale);
	}

	componentWillReceiveProps(props) {
		this._config = getAppConfig(props);
		this.forceUpdate();
	}

	_renderContext() {
		return <AdminContext appConfig={this._config} />;
	}

	render() {
		const { locale } = this._config;
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
