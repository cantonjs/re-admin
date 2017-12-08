
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Modal } from 'antd';
import hoistNonReactStatics from 'hoist-non-react-statics';
import joinKeys from 'utils/joinKeys';
import NavigatorModal from 'components/NavigatorModal';
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
			NavigatorModal.open(Actions.CREATE);
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

		requestUpdate = (names = []) => {
			NavigatorModal.open(
				Actions.UPDATE,
				joinKeys(this.getSelectedKeys()),
				names.join(','),
			);
		};

		render() {
			return (
				<WrappedComponent
					{...this.props}
					actions={{
						requestCreate: this.requestCreate,
						requestUpdate: this.requestUpdate,
						requestRemove: this.requestRemove,
						selectedKeys: this._selectedKeys || this.context.store.selectedKeys,
					}}
				/>
			);
		}
	}

	return hoistNonReactStatics(WithActions, WrappedComponent);
}
