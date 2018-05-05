import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class TableHeadCell extends Component {
	static propTypes = {
		children: PropTypes.node,
		column: PropTypes.shape({
			renderHeaderCell: PropTypes.func,
		}),
	};

	render() {
		const { children, column, ...other } = this.props;
		if (!column) return <th {...other}>{children}</th>;
		const { renderHeaderCell } = column;
		return renderHeaderCell({
			children: (render) => {
				if (!render) return null;
				return <th {...other}>{children}</th>;
			},
		});
	}
}
