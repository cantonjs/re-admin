
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import joinKeys from 'utils/joinKeys';
import ActionModal from 'components/ActionModal';
import * as Actions from 'constants/Actions';

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

		open = (name, config) => {
			ActionModal.open({
				keys: joinKeys(this.getSelectedKeys()),
				...config,
				name,
			});
		};

		openCreaterModal = (options) => {
			this.open(Actions.CREATE, { title: '创建', ...options });
		};

		openUpdaterModal = (options = {}) => {
			const { select, ...other } = options;
			const config = {
				title: '更新',
				...other,
			};
			if (select && select.length) {
				config.select = select.join(',');
			}
			this.open(Actions.UPDATE, config);
		};

		onpenRefModal = (options = {}) => {
			const { table, title, fetch, save, noQuery } = options;
			const config = {
				table,
				title,
				fetch,
				save,
			};
			if (noQuery) { config.noQuery = '✓'; }
			this.open(Actions.REF, config);
		};


		requestCreate = () => {
			ActionModal.open({
				name: Actions.CREATE,
				title: '创建',
			});
		};

		render() {
			return (
				<WrappedComponent
					{...this.props}
					actions={{
						open: this.open,
						openCreaterModal: this.openCreaterModal,
						openUpdaterModal: this.openUpdaterModal,
						openRefModal: this.openRefModal,
						selectedKeys: this._selectedKeys || this.context.store.selectedKeys,
					}}
				/>
			);
		}
	}

	return hoistNonReactStatics(WithActions, WrappedComponent);
}
