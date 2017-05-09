
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Modal, Button } from 'antd';

const confirm = Modal.confirm;

@observer
export default class ButtonRemove extends Component {
	static propTypes = {
		label: PropTypes.node,
		multiLabel: PropTypes.node,
	};

	static defaultProps = {
		label: '删除',
		multiLabel: '批量删除',
		type: 'danger',
	};

	static contextTypes = {
		store: PropTypes.object.isRequired,
	};

	_handleClick = () => {
		confirm({
			title: '确定删除？',
			content: '该操作将不能撤销',
			onOk: () => {
				this.context.store.remove();
			},
			okText: '删除',
		});
	};

	render() {
		const {
			props: { label, multiLabel, ...other },
			context: { store: { selectedKeys: { length } } },
		} = this;
		return (
			<Button
				{...other}
				onClick={this._handleClick}
				disabled={!length}
			>
				{length > 1 ? multiLabel : label}
			</Button>
		);
	}
}
