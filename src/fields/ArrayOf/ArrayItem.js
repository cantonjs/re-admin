
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import { Icon } from 'antd';

export default class ArrayItem extends Component {
	static propTypes = {
		children: PropTypes.node.isRequired,
		id: PropTypes.any.isRequired,
		onRequestRemove: PropTypes.func.isRequired,
	};

	_handleRemove = () => {
		const { onRequestRemove, id } = this.props;
		onRequestRemove(id);
	};

	render() {
		const {
			children,
		} = this.props;

		return (
			<div>
				{children}
				<Icon
					type="minus-circle-o"
					// disabled={keys.length === 1}
					onClick={this._handleRemove}
				/>
			</div>
		);
	}
}
