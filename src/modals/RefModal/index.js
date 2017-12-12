
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
		this._store = new DataStore(table);
		this._hiddenRouterStore = new HiddenRouterStore(this._store);

		if (!isFunction(this._store[fetch])) {
			console.error(`fetch "${fetch}" in table "${table}" not found`);
		}
		else {
			this._store[fetch]({}, Math.random());
		}
	}

	handleOk() {
		const {
			modalStore: {
				state,
				state: { keys, save = 'update' },
			},
			store,
		} = this.context;

		if (!save || !isFunction(store[save])) {
			console.error(`could not save ref with "${save}"`);
			return;
		}

		store[save]({
			body: { refs: this._store.selectedKeys },
			url: joinKeys(keys),
			state,
		});
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
