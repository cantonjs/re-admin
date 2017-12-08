
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { omitBy } from 'lodash';
import * as Actions from 'constants/Actions';
import routerStore from 'stores/routerStore';
import { Modal } from 'antd';
import { UpdaterModal, CreaterModal } from 'modals/Form';

const modals = new Map();
const Name = 'name';
const Keys = 'keys';
const Params = 'params';
let keyPrefix = '';

const registerModal = function registerModal(name, title, component) {
	modals.set(name, { title, component });
};

let registered = false;
const registerBuiltInModalsOnce = function registerBuiltInModalsOnce() {
	if (registered) { return; }
	registerModal(Actions.CREATE, '创建', CreaterModal);
	registerModal(Actions.UPDATE, '更新', UpdaterModal);
	registered = true;
};

@observer
export default class NavigatarModal extends Component {
	static childContextTypes = {
		actionModal: PropTypes.object,
	};

	static contextTypes = {
		store: PropTypes.object.isRequired,
		appConfig: PropTypes.object.isRequired,
	};

	static registerModal = registerModal;

	static makeGetOmitPaths() {
		return function getOmitPaths(val, key) {
			return key.startsWith(keyPrefix);
		};
	}

	static open(name, keys, params) {
		const { location } = routerStore;
		const query = { [`${keyPrefix}${Name}`]: name };
		if (keys) { query[`${keyPrefix}${Keys}`] = keys; }
		if (params) { query[`${keyPrefix}${Params}`] = params; }
		location.query = { ...location.query, ...query };
	}

	getChildContext() {
		return {
			actionModal: {
				getKeys: () => {
					const { query } = routerStore.location;
					const key = `${keyPrefix}${Keys}`;
					return query[key];
				},
				getParams: () => {
					const { query } = routerStore.location;
					const key = `${keyPrefix}${Params}`;
					return query[key];
				},
			},
		};
	}

	componentWillMount() {
		const { routerActionKeyPrefix } = this.context.appConfig.navigator;
		keyPrefix = routerActionKeyPrefix;
		registerBuiltInModalsOnce();
	}

	_close() {
		const { store } = this.context;
		const { location } = routerStore;
		const getOmitPaths = NavigatarModal.makeGetOmitPaths();
		location.query = { ...omitBy(location.query, getOmitPaths) };
		store.setSelectedKeys([]);
	}

	_handleOk = () => {
		if (this._ref && this._ref.handleOk) {
			this._ref.handleOk();
		}
		this._close();
	};

	_handleCancel = () => {
		if (this._ref && this._ref.handleCancel) {
			this._ref.handleCancel();
		}
		this._close();
	};

	render() {
		const { props } = this;
		const { query } = routerStore.location;

		const name = query[`${keyPrefix}${Name}`];
		const visible = name && modals.has(name);
		const modal = modals.get(name);
		const Comp = modal && modal.component;

		return (
			<Modal
				maskClosable={false}
				visible={visible}
				title={visible ? modal.title : ''}
				onOk={this._handleOk}
				onCancel={this._handleCancel}
			>
				{visible && (
					<Comp
						{...props}
						ref={(c) => (this._ref = c)}
					/>
				)}
			</Modal>
		);
	}
}
