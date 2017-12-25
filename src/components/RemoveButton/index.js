
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import ConfirmButton from 'components/ConfirmButton';
import { TOOLBAR } from 'constants/Issuers';

export default class RemoveButton extends Component {
	static propTypes = {
		label: PropTypes.stringOrFunc,
		multiLabel: PropTypes.stringOrFunc,
		title: PropTypes.stringOrFunc,
		content: PropTypes.stringOrFunc,
	};

	static defaultProps = {
		label: '删除',
		multiLabel: '批量删除',
		title: '确定删除？',
		content: '该操作将不能撤销',
	};

	static contextTypes = {
		issuer: PropTypes.instanceOf(Set),
		store: PropTypes.object.isRequired,
	};

	_handleOk = ({ getSelectedKeysString }) => {
		this.context.store.remove({ url: getSelectedKeysString() });
	};

	render() {
		const { issuer } = this.context;
		const isInToolbar = issuer && issuer.has(TOOLBAR);
		const styleTypes = {};
		if (isInToolbar) { styleTypes.type = 'danger'; }
		return (
			<ConfirmButton
				onOk={this._handleOk}
				{...styleTypes}
				{...this.props}
				minSelected={1}
			/>
		);
	}
}
