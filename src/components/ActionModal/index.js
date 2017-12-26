
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import ActionModalStore from 'stores/ActionModalStore';
import routerStore from 'stores/routerStore';
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

	static store = {};

	static init(modals) {
		ActionModal.store = new ActionModalStore(routerStore);
		modals.set(Actions.CREATE, CreaterModal);
		modals.set(Actions.UPDATE, UpdaterModal);
		modals.set(Actions.REF, RefModal);
	}

	static open(modalState) {
		ActionModal.store.state = modalState;
	}

	getChildContext() {
		return { modalStore: ActionModal.store };
	}

	_close() {
		const { store } = this.context;
		ActionModal.store.close();
		store.setSelectedKeys([]);
	}

	_handleOk = (ev) => {
		if (this._child && this._child.handleOk) {
			this._child.handleOk(ev);
		}
		ev.isDefaultPrevented() || this._close();
	};

	_handleCancel = (ev) => {
		if (this._child && this._child.handleCancel) {
			this._child.handleCancel(ev);
		}
		ev.isDefaultPrevented() || this._close();
	};

	render() {
		const { context: { appConfig: { modals } } } = this;
		const { action, title, width } = ActionModal.store.state;
		const visible = action && modals.has(action);
		const Comp = modals.get(action);
		return (
			<Modal
				maskClosable={false}
				visible={visible}
				title={visible ? (title || action) : ''}
				onOk={this._handleOk}
				onCancel={this._handleCancel}
				width={+width || 880}
			>
				{visible && (
					<Comp
						ref={(c) => (this._child = c)}
						{...ActionModal.store.state}
						close={ActionModal.store.close}
					/>
				)}
			</Modal>
		);
	}
}
