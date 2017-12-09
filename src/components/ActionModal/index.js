
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import modalStore from 'stores/modalStore';
import * as Actions from 'constants/Actions';
import { Modal } from 'antd';
import { UpdaterModal, CreaterModal } from 'modals/FormModals';
import RefModal from 'modals/RefModal';

@observer
export default class ActionModal extends Component {
	static childContextTypes = {
		modalStore: PropTypes.object,
	};

	static contextTypes = {
		store: PropTypes.object.isRequired,
		appConfig: PropTypes.object.isRequired,
	};

	static init(modals) {
		modals.set(Actions.CREATE, CreaterModal);
		modals.set(Actions.UPDATE, UpdaterModal);
		modals.set(Actions.REF, RefModal);
	}

	static open(modalState) {
		modalStore.state = modalState;
	}

	getChildContext() {
		return { modalStore };
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
		const { props, context: { appConfig: { modals } } } = this;
		const { name, title } = modalStore.state;
		const visible = name && modals.has(name);
		const Comp = modals.get(name);

		return (
			<Modal
				maskClosable={false}
				visible={visible}
				title={visible ? (title || name) : ''}
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
