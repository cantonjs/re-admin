import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';

export default class Nonconductor extends Component {
	static propTypes = {
		component: PropTypes.component.isRequired,
	};

	shouldComponentUpdate() {
		return false;
	}

	render() {
		const Comp = this.props.component;
		return <Comp />;
	}
}
