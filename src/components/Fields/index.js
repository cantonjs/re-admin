
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Fields extends Component {
	static propTypes = {
		children: PropTypes.node,
	};

	constructor(props) {
		super(props);

		console.log('fields props', props);
	}

	render() {
		return (
			<div>{this.props.children}</div>
		);
	}
}
