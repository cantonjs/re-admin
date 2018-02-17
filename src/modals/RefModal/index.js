import PropTypes from 'utils/PropTypes';
import React, { Component } from 'react';
import joinKeys from 'utils/joinKeys';
import dataStoreProvider from 'hoc/dataStoreProvider';
import TableBody from 'components/TableBody';
import TableQuery from 'components/TableQuery';

@dataStoreProvider()
export default class RefModal extends Component {
	static propTypes = {
		table: PropTypes.string.isRequired,
		fetch: PropTypes.string,
		keys: PropTypes.string,
		save: PropTypes.string,
		noQuery: PropTypes.any,
		store: PropTypes.object,
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
		const { props: { fetch, store: refStore }, props } = this;
		refStore.call(fetch, props);
	}

	handleOk() {
		const {
			context: { store },
			props,
			props: { keys, save, store: refStore },
		} = this;

		const { pathname } = refStore;
		const refKeys = refStore.selectedKeys;
		const url = joinKeys(keys) + `/${pathname}/` + joinKeys(refKeys);
		store.call(save, { method: 'POST', url, ...props, keys, refKeys });
	}

	render() {
		const { props: { noQuery, store } } = this;

		return (
			<div>
				{!noQuery && <TableQuery store={store} />}
				<TableBody store={store} selectionType="radio" />
			</div>
		);
	}
}
