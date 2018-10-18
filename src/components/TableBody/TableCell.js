import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TableContext from './TableContext';

export default class TableCell extends Component {
	static propTypes = {
		children: PropTypes.node,
		renderCell: PropTypes.func,
		store: PropTypes.object,
	};

	_handleClick = () => {
		const { record } = this.props.store;
		this.tableContext.toggleSelectedKey(record.key);
	};

	_renderChildren(children, other) {
		return (
			<td {...other} onClick={this._handleClick}>
				{children}
			</td>
		);
	}

	_render = (tableContext) => {
		this.tableContext = tableContext;
		const { renderCell, store, children, ...other } = this.props;
		if (!renderCell) return this._renderChildren(children, other);
		return renderCell(
			store,
			(render) => (render ? this._renderChildren(render(), other) : null)
		);
	};

	render() {
		return <TableContext.Consumer>{this._render}</TableContext.Consumer>;
	}
}
