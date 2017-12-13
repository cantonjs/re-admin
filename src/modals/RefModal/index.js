
import PropTypes from 'utils/PropTypes';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import HiddenRouterStore from './HiddenRouterStore';
import joinKeys from 'utils/joinKeys';
import DataStore from 'stores/DataStore';
import TableBody from 'components/TableBody';
import TableQuery from 'components/TableQuery';

@observer
export default class RefModal extends Component {
	static contextTypes = {
		modalStore: PropTypes.object.isRequired,
		store: PropTypes.object.isRequired,
	};

	componentWillMount() {
		const {
			state,
			state: { table, fetch = 'fetch' },
		} = this.context.modalStore;
		this._refStore = new DataStore(table);
		this._hiddenRouterStore = new HiddenRouterStore(this._refStore, state);
		this._refStore.call(fetch, state);
	}

	handleOk() {
		const {
			context: {
				modalStore: {
					state,
					state: { keys, save = 'request' },
				},
				store,
			},
			_refStore,
		} = this;

		const { pathname } = _refStore;
		const refKeys = _refStore.selectedKeys;
		const url = joinKeys(keys) + `/${pathname}/` + joinKeys(refKeys);
		store.call(save, { method: 'POST', url, ...state, keys, refKeys });
	}

	render() {
		const {
			_hiddenRouterStore,
			_refStore,
			context: { modalStore: { state } },
		} = this;

		return (
			<div>
				{!state.noQuery &&
					<TableQuery
						store={_refStore}
						routerStore={_hiddenRouterStore}
					/>
				}
				<TableBody
					store={_refStore}
					routerStore={_hiddenRouterStore}
					selectionType="radio"
				/>
			</div>
		);
	}
}
