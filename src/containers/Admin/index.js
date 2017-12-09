
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AdminContext from 'containers/AdminContext';
import getConfig from './getConfig';
import moment from 'moment';
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
	};

	componentWillMount() {
		const { children, config } = this.props;
		this._config = getConfig(children || config);
	}

	componentWillReceiveProps({ children, config }) {
		// console.log(children || config);
		this._config = getConfig(children || config);
		this.forceUpdate();
	}

	render() {
		return (
			<AdminContext appConfig={this._config} />
		);
	}
}
