
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
		const {
			modalStore: {
				state: { keys, table, fetch = 'fetch', save = 'update' },
				onOk,
			},
			store: dataStore,
		} = this.context;
		this._store = new DataStore(table);
		this._hiddenRouterStore = new HiddenRouterStore(this._store);

		if (!isFunction(this._store[fetch])) {
			console.error(`fetch "${fetch}" in table "${table}" not found`);
		}
		else {
			this._store[fetch]({}, Math.random());
			if (!save || !isFunction(dataStore[save])) {
				console.error(`could not save ref with "${save}"`);
			}
			else {
				onOk(() => {
					dataStore[save]({
						body: { refs: this._store.selectedKeys },
						url: joinKeys(keys),
					});
				});
			}
		}
	}

	componentWillUnmount() {
		this.context.modalStore.offOk();
	}

	render() {
		const {
			_hiddenRouterStore,
			_store,
			context: { modalStore: { state } },
		} = this;

		return (
			<div>
				{!state.noQuery &&
					<TableQuery
						store={_store}
						routerStore={_hiddenRouterStore}
					/>
				}
				<TableBody
					store={_store}
					routerStore={_hiddenRouterStore}
					selectionType="radio"
				/>
			</div>
		);
	}
}
