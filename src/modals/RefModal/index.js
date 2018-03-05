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
		header: PropTypes.component,
		footer: PropTypes.component,
		modalFooter: PropTypes.component,
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
		isFunction(fetch) ? fetch(props) : refStore.service.call(fetch, props);
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
		isFunction(save) ? save(options) : store.service.call(save, options);
	};

	render() {
		const {
			noQuery,
			store,
			title,
			width,
			header: Header,
			footer: Footer,
			modalFooter: ModalFooter,
		} = this.props;
		return (
			<ModalConsumer
				width={width}
				title={title}
				onOk={this._handleOk}
				footer={ModalFooter && <ModalFooter store={store} />}
			>
				<div>
					{Header && <Header store={store} />}
					{!noQuery && <TableQuery store={store} />}
					<TableBody store={store} selectionType="radio" />
					{Footer && <Footer store={store} />}
				</div>
			</ModalConsumer>
		);
	}
}
