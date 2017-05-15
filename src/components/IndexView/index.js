
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class IndexView extends Component {
	static propTypes = {
		children: PropTypes.node,
	};

	static defaultProps = {
		children: 'Welcome',
	};

	render() {
		return (
			<div>Welcome</div>
		);
	}
}
