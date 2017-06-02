
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import { Icon } from 'antd';

const styles = {
	container: {
		padding: 12,
		margin: '12px 0',
		position: 'relative',
		border: '1px dashed #dedede',
		backgroundColor: '#f4f4f4',
	},

	icon: {
		position: 'absolute',
		right: 12,
		top: 16,
	},
};

export default class ArrayItem extends Component {
	static propTypes = {
		children: PropTypes.node.isRequired,
		id: PropTypes.any.isRequired,
		onRequestRemove: PropTypes.func.isRequired,
	};

	_handleRemove = (ev) => {
		ev.preventDefault();
		const { onRequestRemove, id } = this.props;
		onRequestRemove(id);
	};

	render() {
		const {
			children,
		} = this.props;

		return (
			<div style={styles.container}>
				{children}
				<a href="#" onClick={this._handleRemove}>
					<Icon
						style={styles.icon}
						type="minus-circle-o"
					/>
				</a>
			</div>
		);
	}
}
