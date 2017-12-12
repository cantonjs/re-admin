
import PropTypes from 'utils/PropTypes';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import HiddenRouterStore from './HiddenRouterStore';
import { isFunction } from 'lodash';
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
		const { table, fetch = 'fetch' } = this.context.modalStore.state;
		this._refStore = new DataStore(table);
		this._hiddenRouterStore = new HiddenRouterStore(this._refStore);

		if (!isFunction(this._refStore[fetch])) {
			console.error(`fetch "${fetch}" in table "${table}" not found`);
		}
		else {
			this._refStore[fetch]({}, Math.random());
		}
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

		if (!save || !isFunction(store[save])) {
			console.error(`could not save ref with "${save}"`);
			return;
		}

		const { pathname } = _refStore;
		const refKeys = _refStore.selectedKeys;

		store[save]({
			method: 'POST',
			url: joinKeys(keys) + `/${pathname}/` + joinKeys(refKeys),
			state,
		});
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
