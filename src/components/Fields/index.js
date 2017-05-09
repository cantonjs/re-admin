
import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';

export default class Fields extends Component {
	static propTypes = {
		children: PropTypes.node,
	};

	render() {
		const { children } = this.props;
		return (
			<div>{children}</div>
		);
	}

	// render() {
	// 	const { children, ...other } = this.props;
	// 	return (
	// 		<div>
	// 			{Children.map(children, (child) => cloneElement(child, other))}
	// 		</div>
	// 	);
	// }
}
