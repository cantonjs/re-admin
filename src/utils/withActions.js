
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Modal } from 'antd';
import { isString, isNumber } from 'lodash';

const confirm = Modal.confirm;

// Notice that this `Action` is NOT redux action.
export default function withActions(WrappedComponent) {

	@observer
	class WithActions extends Component {
		static contextTypes = {
			store: PropTypes.object.isRequired,
			updateLocationQuery: PropTypes.func.isRequired,
		};

		requestCreate = () => {
			this.context.updateLocationQuery({ _action: 'create' });
		};

		requestRemove = (keys) => {
			const { store } = this.context;
			confirm({
				title: '确定删除？',
				content: '该操作将不能撤销',
				onOk: () => {
					store.remove(keys || store.selectedKeys);
				},
				okText: '删除',
			});
		};

		requestUpdate = (keys, names) => {
			const { updateLocationQuery, store } = this.context;

			if (isString(keys) || isNumber(keys)) { keys = [keys]; }
			if (!Array.isArray(keys)) { keys = store.selectedKeys; }

			const query = {
				_action: 'update',
				_keys: keys.join(','),
			};

			if (names && names.length) {
				query._names = names.join(',');
			}

			updateLocationQuery(query);
		};

		render() {
			const { selectedKeys } = this.context.store;
			return (
				<WrappedComponent
					{...this.props}
					actions={{
						requestCreate: this.requestCreate,
						requestUpdate: this.requestUpdate,
						requestRemove: this.requestRemove,
						selectedKeys,
					}}
				/>
			);
		}
	}

	return WithActions;
}
