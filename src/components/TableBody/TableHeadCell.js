import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

@observer
export default class TableHeadCell extends Component {
	static propTypes = {
		children: PropTypes.node,
		renderHeaderCell: PropTypes.func,
	};

	render() {
		const { children, renderHeaderCell, ...other } = this.props;
		if (!renderHeaderCell) return <th {...other}>{children}</th>;
		return renderHeaderCell({
			children: (render) => {
				if (!render) return null;
				return <th {...other}>{children}</th>;
			},
		});
	}
}
