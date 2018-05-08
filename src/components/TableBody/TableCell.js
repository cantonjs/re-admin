import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class TableCell extends Component {
	static propTypes = {
		children: PropTypes.node,
		renderCell: PropTypes.func,
		store: PropTypes.object,
	};

	render() {
		const { renderCell, store, children, ...other } = this.props;
		if (!renderCell) return <td {...other}>{children}</td>;
		return renderCell(
			store,
			(render) => (render ? <td {...other}>{render()}</td> : null)
		);
	}
}
