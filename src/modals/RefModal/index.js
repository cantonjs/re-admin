import PropTypes from 'utils/PropTypes';
import React, { Component } from 'react';
import joinKeys from 'utils/joinKeys';
import { isFunction } from 'lodash';
import dataStoreProvider from 'hoc/dataStoreProvider';
import ModalConsumer from 'components/ModalConsumer';
import TableBody from 'components/TableBody';
import TableQuery from 'components/TableQuery';

@dataStoreProvider()
export default class RefModal extends Component {
	static propTypes = {
		table: PropTypes.string.isRequired,
		fetch: PropTypes.stringOrFunc,
		keys: PropTypes.string,
		save: PropTypes.stringOrFunc,
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
		isFunction(fetch) ? fetch(props) : refStore.call(fetch, props);
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
		const options = { method: 'POST', url, ...props, keys, refKeys, refStore };
		isFunction(save) ? save(options) : store.call(save, options);
	};

	render() {
		const { props: { noQuery, store, title, width } } = this;
		return (
			<ModalConsumer width={width} title={title} onOk={this._handleOk}>
				<div>
					{!noQuery && <TableQuery store={store} />}
					<TableBody store={store} selectionType="radio" />
				</div>
			</ModalConsumer>
		);
	}
}
