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
	static propTypes = {
		table: PropTypes.string.isRequired,
		fetch: PropTypes.string,
		keys: PropTypes.string,
		save: PropTypes.string,
		noQuery: PropTypes.any,
	};

	static defaultProps = {
		fetch: 'fetch',
		save: 'request',
		noQuery: false,
	};

	static contextTypes = {
		modalStore: PropTypes.object.isRequired,
		store: PropTypes.object.isRequired,
	};

	componentWillMount() {
		const { props: { table, fetch }, props } = this;
		this._refStore = new DataStore(table);
		this._hiddenRouterStore = new HiddenRouterStore(this._refStore, props);
		this._refStore.call(fetch, props);
	}

	handleOk() {
		const {
			context: { store },
			props,
			props: { keys, save },
			_refStore,
		} = this;

		const { pathname } = _refStore;
		const refKeys = _refStore.selectedKeys;
		const url = joinKeys(keys) + `/${pathname}/` + joinKeys(refKeys);
		store.call(save, { method: 'POST', url, ...props, keys, refKeys });
	}

	render() {
		const {
			_hiddenRouterStore: { location },
			_refStore,
			props: { noQuery },
		} = this;

		return (
			<div>
				{!noQuery && <TableQuery store={_refStore} location={location} />}
				<TableBody
					store={_refStore}
					location={location}
					selectionType="radio"
				/>
			</div>
		);
	}
}
