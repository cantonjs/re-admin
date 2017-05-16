
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AdminContext from 'containers/AdminContext';
import getConfig from './getConfig';

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
		}),
	};

	componentWillMount() {
		this._config = getConfig(this.props.config);
	}

	render() {
		return (
			<AdminContext appConfig={this._config} />
		);
	}
}
