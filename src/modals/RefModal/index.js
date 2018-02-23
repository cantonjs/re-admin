import PropTypes from 'utils/PropTypes';
import React, { Component } from 'react';
import joinKeys from 'utils/joinKeys';
import dataStoreProvider from 'hoc/dataStoreProvider';
import ModalBridge from 'components/ModalBridge';
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
		title: PropTypes.node,
		width: PropTypes.stringOrNumber,
	};

	static defaultProps = {
		fetch: 'fetch',
		save: 'request',
		noQuery: false,
		title: 'Reference',
		width: 800,
	};

	static contextTypes = {
		modalStore: PropTypes.object.isRequired,
		store: PropTypes.object.isRequired,
	};

	componentWillMount() {
		const { props: { fetch, store: refStore }, props } = this;
		refStore.call(fetch, props);
	}

	_handleOk = () => {
		const {
			context: { store },
			props,
			props: { keys, save, store: refStore },
		} = this;
		const { pathname } = refStore;
		const refKeys = refStore.selectedKeys;
		const url = joinKeys(keys) + `/${pathname}/` + joinKeys(refKeys);
		store.call(save, { method: 'POST', url, ...props, keys, refKeys });
	};

	render() {
		const { props: { noQuery, store, title, width } } = this;
		return (
			<ModalBridge width={width} title={title} onOk={this._handleOk}>
				<div>
					{!noQuery && <TableQuery store={store} />}
					<TableBody store={store} selectionType="radio" />
				</div>
			</ModalBridge>
		);
	}
}
