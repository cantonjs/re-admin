
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import ContextButton from 'components/ContextButton';
import { Modal } from 'antd';
import { TOOLBAR } from 'constants/Issuers';

const { confirm } = Modal;

export default class RemoveButton extends Component {
	static propTypes = {
		label: PropTypes.node,
		multiLabel: PropTypes.node,
	};

	static defaultProps = {
		label: '删除',
		multiLabel: '批量删除',
	};

	static contextTypes = {
		issuer: PropTypes.string,
		store: PropTypes.object.isRequired,
	};

	_handleClick = (ev, { getSelectedKeysString }) => {
		ev.preventDefault();
		const { store } = this.context;
		confirm({
			title: '确定删除？',
			content: '该操作将不能撤销',
			onOk: () => {
				store.remove({ url: getSelectedKeysString() });
			},
			okText: '删除',
		});
	};

	render() {
		const isInToolbar = this.context.issuer === TOOLBAR;
		const styleTypes = {};
		if (isInToolbar) { styleTypes.type = 'danger'; }
		return (
			<ContextButton
				onClick={this._handleClick}
				{...styleTypes}
				{...this.props}
				minSelected={1}
			/>
		);
	}
}
