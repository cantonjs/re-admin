import React, { Component } from 'react';
import PropTypes from 'prop-types';
import getConfig from './getConfig';
import localeStore from 'stores/localeStore';
import moment from 'moment';
import AdminContext from 'containers/AdminContext';
import 'moment/locale/zh-cn';

// TODO: should be able to custom
moment.locale('zh-cn');

export default class Admin extends Component {
	static propTypes = {
		config: PropTypes.shape({
			name: PropTypes.string,
			sidebar: PropTypes.array,
			tables: PropTypes.object,
			api: PropTypes.object,
			auth: PropTypes.object,
			upload: PropTypes.object,
			router: PropTypes.any,
			views: PropTypes.object,
			modals: PropTypes.object,
		}),
		children: PropTypes.node,
		locale: PropTypes.object,
	};

	componentWillMount() {
		const { children, config, locale } = this.props;
		if (locale) {
			localeStore.set(locale);
		}
		this._config = getConfig(children || config);
	}

	componentWillReceiveProps({ children, config }) {
		this._config = getConfig(children || config);
		this.forceUpdate();
	}

	render() {
		return <AdminContext appConfig={this._config} />;
	}
}
