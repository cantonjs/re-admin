
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Modal } from 'antd';
import hoistNonReactStatics from 'hoist-non-react-statics';
import joinKeys from 'utils/joinKeys';
import ActionModal from 'components/ActionModal';
import * as Actions from 'constants/Actions';

const { confirm } = Modal;

// Notice that this `Action` is NOT Redux or MobX action.
export default function withActions(WrappedComponent) {

	@observer
	class WithActions extends Component {
		static contextTypes = {
			store: PropTypes.object.isRequired,
			tableRowKey: PropTypes.string,
		};

		componentWillMount() {
			const { tableRowKey } = this.context;
			if (tableRowKey) {
				this._selectedKeys = [tableRowKey];
			}
		}

		getSelectedKeys() {
			const { tableRowKey, store } = this.context;
			return tableRowKey ? [tableRowKey] : store.selectedKeys;
		}

		requestCreate = () => {
			ActionModal.open({
				name: Actions.CREATE,
				title: '创建',
			});
		};

		requestRemove = () => {
			const { store } = this.context;
			confirm({
				title: '确定删除？',
				content: '该操作将不能撤销',
				onOk: () => {
					store.remove({ url: joinKeys(this.getSelectedKeys()) });
				},
				okText: '删除',
			});
		};

		requestUpdate = (select) => {
			const config = {
				name: Actions.UPDATE,
				title: '更新',
				keys: joinKeys(this.getSelectedKeys()),
			};
			if (select && select.length) {
				config.select = select.join(',');
			}
			ActionModal.open(config);
		};

		requestRef = (options = {}) => {
			const { table, title, fetch, save, noQuery } = options;
			const config = {
				name: Actions.REF,
				keys: joinKeys(this.getSelectedKeys()),
				table,
				title,
				fetch,
				save,
			};
			if (noQuery) { config.noQuery = '✓'; }
			ActionModal.open(config);
		};

		render() {
			return (
				<WrappedComponent
					{...this.props}
					actions={{
						requestCreate: this.requestCreate,
						requestUpdate: this.requestUpdate,
						requestRemove: this.requestRemove,
						requestRef: this.requestRef,
						selectedKeys: this._selectedKeys || this.context.store.selectedKeys,
					}}
				/>
			);
		}
	}

	return hoistNonReactStatics(WithActions, WrappedComponent);
}
