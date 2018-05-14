import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import hoist, { extractRef } from 'hocs/hoist';
import joinKeys from 'utils/joinKeys';
import withModalStore from 'hocs/withModalStore';
import withStore from 'hocs/withStore';
import * as Actions from 'constants/Actions';

// Notice that this `Action` is NOT Redux or MobX action.
export default function withActions(WrappedComponent) {
	@hoist(WrappedComponent)
	@withStore()
	@withModalStore()
	@observer
	class WithActions extends Component {
		static propTypes = {
			modalStore: PropTypes.object.isRequired,
			store: PropTypes.object.isRequired,
		};

		static contextTypes = {
			tableRowKey: PropTypes.string,
		};

		constructor(props, context) {
			super(props, context);
			const { tableRowKey } = context;
			if (tableRowKey) {
				this._selectedKeys = [tableRowKey];
			}
		}

		getSelectedKeys() {
			const { context: { tableRowKey }, props: { store } } = this;
			return tableRowKey ? [tableRowKey] : store.selectedKeys;
		}

		getSelectedKeysString = () => {
			return joinKeys(this.getSelectedKeys());
		};

		open = (name, params, options) => {
			this.props.modalStore.open(
				{
					keys: joinKeys(this.getSelectedKeys()),
					...params,
					name,
				},
				options
			);
		};

		openCreaterModal = (params = {}, options) => {
			params.keys = params.keys || '';
			this.open(Actions.CREATE, params, options);
		};

		openUpdaterModal = (params = {}, options) => {
			const { select, ...config } = params;
			if (select && select.length) {
				config.select = select.join(',');
			}
			this.open(Actions.UPDATE, config, options);
		};

		openRefModal = (params = {}, options) => {
			const {
				table,
				title,
				noQuery,
				fetch = 'fetch',
				save = 'request',
				width = 880,
			} = params;
			const config = { table, title, fetch, save, width };
			if (noQuery) config.noQuery = '✓';
			this.open(Actions.REF, config, options);
		};

		_getData = () => {
			const selectedKeys = this.getSelectedKeys();
			return this.props.store.getData(selectedKeys[0]);
		};

		render() {
			const { props: { modalStore, store, ...props } } = this;
			return (
				<WrappedComponent
					{...extractRef(props)}
					actions={{
						store,
						open: this.open,
						openCreaterModal: this.openCreaterModal,
						openUpdaterModal: this.openUpdaterModal,
						openRefModal: this.openRefModal,
						selectedKeys: this._selectedKeys || store.selectedKeys,
						getSelectedKeysString: this.getSelectedKeysString,
						getData: this._getData,
					}}
				/>
			);
		}
	}

	return WithActions;
}
