import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

@observer
export default class TableHeadCell extends Component {
	static propTypes = {
		children: PropTypes.node,
		renderCell: PropTypes.func,
	};

	render() {
		const { children, renderCell, ...other } = this.props;
		if (!renderCell) return <th {...other}>{children}</th>;
		return renderCell(
			{},
			(render) => (render ? <th {...other}>{children}</th> : <td />)
		);
	}
}
