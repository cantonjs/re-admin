
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';

const confirm = Modal.confirm;

export default class UpdateAction extends Component {
	static propTypes = {
		recordKey: PropTypes.any,
		children: PropTypes.node,
	};

	static defaultProps = {
		children: '更新',
	};

	static contextTypes = {
		store: PropTypes.object.isRequired,
	};

	_handleClick = () => {
		const { context: { store }, props: { recordKey } } = this;
		confirm({
			title: '确定更新？',

			// TODO
			content: '更新操作尚未开发完成 😂',

			onOk: () => alert('Update failed.'),
			okText: '更新',
		});
	};

	render() {
		const {
			props: {

				recordKey,

				children,
				...other,
			},
		} = this;
		return (
			<a
				href="#"
				onClick={this._handleClick}
				{...other}
			>
				{children}
			</a>
		);
	}
}
