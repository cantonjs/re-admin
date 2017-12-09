
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import * as Actions from 'constants/Actions';
import modalStore from 'stores/modalStore';
import { Modal } from 'antd';
import { UpdaterModal, CreaterModal } from 'modals/FormModals';
import RefModal from 'modals/RefModal';

const modals = new Map();

const registerModal = function registerModal(name, component) {
	modals.set(name, component);
};

let registered = false;
const registerBuiltInModalsOnce = function registerBuiltInModalsOnce() {
	if (registered) { return; }
	registerModal(Actions.CREATE, CreaterModal);
	registerModal(Actions.UPDATE, UpdaterModal);
	registerModal(Actions.REF, RefModal);
	registered = true;
};

@observer
export default class NavigatarModal extends Component {
	static childContextTypes = {
		modalStore: PropTypes.object,
	};

	static contextTypes = {
		store: PropTypes.object.isRequired,
	};

	static registerModal = registerModal;

	static open(modalState) {
		modalStore.state = modalState;
	}

	getChildContext() {
		return { modalStore };
	}

	componentWillMount() {
		registerBuiltInModalsOnce();
	}

	_close() {
		const { store } = this.context;
		modalStore.close();
		store.setSelectedKeys([]);
	}

	_handleOk = () => {
		modalStore.emitOk();
		this._close();
	};

	_handleCancel = () => {
		this._close();
	};

	render() {
		const { props } = this;
		const { name, title } = modalStore.state;
		const visible = name && modals.has(name);
		const Comp = modals.get(name);

		return (
			<Modal
				maskClosable={false}
				visible={visible}
				title={visible ? title : ''}
				onOk={this._handleOk}
				onCancel={this._handleCancel}
			>
				{visible && (
					<Comp {...props} />
				)}
			</Modal>
		);
	}
}
