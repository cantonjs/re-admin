
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';

const confirm = Modal.confirm;

export default class RemoveAction extends Component {
	static propTypes = {
		recordKey: PropTypes.any.isRequired,
		children: PropTypes.node,
	};

	static defaultProps = {
		children: '删除',
	};

	static contextTypes = {
		store: PropTypes.object.isRequired,
	};

	_handleClick = () => {
		const { context: { store }, props: { recordKey } } = this;
		confirm({
			title: '确定删除？',
			content: '该操作将不能撤销',
			onOk: () => store.remove(recordKey),
			okText: '删除',
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
