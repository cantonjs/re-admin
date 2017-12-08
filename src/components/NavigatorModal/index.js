
import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { map, omit, isFunction } from 'lodash';
import * as Actions from 'constants/Actions';
import * as Issuers from 'constants/Issuers';
import { returnsArgument } from 'empty-functions';
import routerStore from 'stores/routerStore';
import joinKeys from 'utils/joinKeys';
import { Modal } from 'antd';
import Form from 'modals/Form';

const modals = new Map();

const registerModal = function registerModal(name, title, renderChildren) {
	modals.set(name, { title, renderChildren });
};

let registered = false;
const registerBuiltInModalsOnce = function registerBuiltInModalsOnce() {
	if (registered) { return; }
	registerModal('create', '创建', Form.createRenderer('create'));
	registerModal('update', '更新', Form.createRenderer('update'));
	registered = true;
};

// TODO
const getOmitPaths = function getOmitPaths() {
	return ['opt_action', 'opt_keys'];
};

@observer
export default class NavigatarModal extends Component {
	static contextTypes = {
		store: PropTypes.object.isRequired,
		appConfig: PropTypes.object.isRequired,
	};

	static registerModal = registerModal;

	static getOmitPaths = getOmitPaths;

	componentWillMount() {
		registerBuiltInModalsOnce();
	}

	// close() {
	// 	const { store } = this.context;
	// 	const { location } = routerStore;
	// 	location.query = { ...omit(location.query, ActionModal.omitPaths) };
	// 	store.setSelectedKeys([]);
	// }

	_handleOk = () => {
		if (this._ref && this._ref.handleOk) {
			this._ref.handleOk();
		}
	};

	_handleCancel = () => {
		if (this._ref && this._ref.handleCancel) {
			this._ref.handleCancel();
		}
	};

	// _handleSubmit = (body, { isInvalid }) => {
	// 	if (!isInvalid) {
	// 		const { store } = this.props;
	// 		const { _action, _keys } = routerStore.location.query;
	// 		const isValidRequest = isFunction(store[_action]);

	// 		if (isValidRequest) {
	// 			const keys = _keys || store.selectedKeys;
	// 			const url = joinKeys(keys);
	// 			store[_action]({ url, body });
	// 		}

	// 		this.close();
	// 	}
	// 	else if (__DEV__) {
	// 		console.warn('INVALID');
	// 	}
	// };

	// _saveForm = (form) => {
	// 	if (form) { this._form = form; }
	// };

	render() {
		const { props, context } = this;
		const {
			appConfig: { navigator: { routerActionKeyPrefix } },
		} = context;
		const { query } = routerStore.location;

		const name = query[`${routerActionKeyPrefix}action`];
		const visible = name && modals.has(name);

		const getModel = modals.get(name);
		const children = visible && getModel.renderChildren({ ...props }, context);

		return (
			<Modal
				maskClosable={false}
				visible={visible}
				title={visible ? getModel.title : ''}
				onOk={this._handleOk}
				onCancel={this._handleCancel}
			>
				{children && cloneElement(children, {
					ref: (c) => (this._ref = c),
				})}
			</Modal>
		);

		// return (
		// 	<ActionModalInternal
		// 		ref={this._saveForm}
		// 		search={search}
		// 		visible={visible}
		// 		title={title}
		// 		onSubmit={this._handleSubmit}
		// 		onOk={this._handleOk}
		// 		onCancel={this._handleCancel}
		// 		formRenderers={formRenderers}
		// 	/>
		// );
	}
}

