import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import joinKeys from 'utils/joinKeys';
import modalStore from 'stores/modalStore';
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

		getSelectedKeysString = () => {
			return joinKeys(this.getSelectedKeys());
		};

		open = (name, config) => {
			const { useLocation, ...other } = config;
			modalStore.setState(
				{
					keys: joinKeys(this.getSelectedKeys()),
					...other,
					name,
				},
				useLocation
			);
		};

		openCreaterModal = (options = {}) => {
			options.keys = options.keys || '';
			this.open(Actions.CREATE, {
				title: '创建',
				useLocation: true,
				...options,
			});
		};

		openUpdaterModal = (options = {}) => {
			const { select, ...other } = options;
			const config = {
				title: '更新',
				useLocation: true,
				...other,
			};
			if (select && select.length) {
				config.select = select.join(',');
			}
			this.open(Actions.UPDATE, config);
		};

		openRefModal = (options = {}) => {
			const {
				table,
				title,
				noQuery,
				fetch = 'fetch',
				save = 'request',
				width = 880,
				useLocation = true,
			} = options;
			const config = {
				table,
				title,
				fetch,
				save,
				width,
				useLocation,
			};
			if (noQuery) {
				config.noQuery = '✓';
			}
			this.open(Actions.REF, config);
		};

		_getData = () => {
			const selectedKeys = this.getSelectedKeys();
			return this.context.store.getData(selectedKeys[0]);
		};

		render() {
			const { props, context: { store } } = this;
			return (
				<WrappedComponent
					{...props}
					actions={{
						store,
						open: this.open,
						openCreaterModal: this.openCreaterModal,
						openUpdaterModal: this.openUpdaterModal,
						openRefModal: this.openRefModal,
						selectedKeys: this._selectedKeys || this.context.store.selectedKeys,
						getSelectedKeysString: this.getSelectedKeysString,
						getData: this._getData,
					}}
				/>
			);
		}
	}

	return hoistNonReactStatics(WithActions, WrappedComponent);
}
