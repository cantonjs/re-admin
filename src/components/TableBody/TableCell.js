import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class TableCell extends Component {
	static propTypes = {
		children: PropTypes.node,
		renderBodyCell: PropTypes.func,
		renderProps: PropTypes.object,
	};

	render() {
		const { renderBodyCell, renderProps, children, ...other } = this.props;
		if (!renderBodyCell) return <td {...other}>{children}</td>;
		return renderBodyCell(renderProps, {
			children: (render) => {
				if (!render) return null;
				return <td {...other}>{render()}</td>;
			},
		});
	}
}
