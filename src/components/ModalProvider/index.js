import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import modalStore from 'stores/modalStore';
import { Modal } from 'antd';

@observer
export default class ModalProvider extends Component {
	static contextTypes = {
		store: PropTypes.object.isRequired,
		appConfig: PropTypes.object.isRequired,
	};

	static childContextTypes = {
		modalStore: PropTypes.object,
	};

	getChildContext() {
		return { modalStore };
	}

	_close() {
		modalStore.close();
		this.context.store.setSelectedKeys([]);
	}

	_handleOk = (ev) => {
		const { modalProps } = modalStore;
		if (modalProps.onOk) {
			modalProps.onOk(ev);
		}
		ev.isDefaultPrevented() || this._close();
	};

	_handleCancel = (ev) => {
		const { modalProps } = modalStore;
		if (modalProps.onCancel) {
			modalProps.onCancel(ev);
		}
		ev.isDefaultPrevented() || this._close();
	};

	render() {
		const { context: { appConfig: { modals } } } = this;
		const { visible, modalProps, state, name } = modalStore;
		const Comp = modals.get(name);
		return (
			<Modal
				maskClosable={false}
				{...modalProps}
				visible={visible}
				onOk={this._handleOk}
				onCancel={this._handleCancel}
			>
				{visible && <Comp {...state} />}
			</Modal>
		);
	}
}
