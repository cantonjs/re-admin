
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContextButton from 'components/ContextButton';
import { Modal } from 'antd';

export default class ConfirmButton extends Component {
	static propTypes = {
		title: PropTypes.string.isRequired,
		content: PropTypes.string,
		onOk: PropTypes.func,
		okText: PropTypes.string,
		method: PropTypes.string,
	};

	static defaultProps = {
		okText: '删除',
	};

	_handleClick = (ev, actions) => {
		const { title, content, onOk, okText, method } = this.props;
		ev.preventDefault();
		Modal.confirm({
			title,
			content,
			okText,
			onOk: () => {
				if (onOk) { onOk(actions); }
				if (method) {
					actions.store.call(method, {
						method: 'POST',
						keys: actions.selectedKeys,
					});
				}
			}
		});
	};

	render() {
		const {
			title, content, onOk, okText, method,
			...other,
		} = this.props;
		return (
			<ContextButton
				{...other}
				onClick={this._handleClick}
			/>
		);
	}
}
