import PropTypes from 'utils/PropTypes';
import React, { Component } from 'react';
import joinKeys from 'utils/joinKeys';
import { REF } from 'utils/Issuers';
import { isFunction } from 'lodash';
import withTable from 'hocs/withTable';
import withIssuer from 'hocs/withIssuer';
import withStore from 'hocs/withStore';
import ModalConsumer from 'components/ModalConsumer';
import TableBody from 'components/TableBody';
import TableQuery from 'components/TableQuery';
import DefaultToolbar from 'components/DefaultToolbar';

@withTable()
@withStore({ prop: 'contextStore' })
@withIssuer({ issuer: REF })
export default class RefModal extends Component {
	static propTypes = {
		table: PropTypes.string.isRequired,
		fetch: PropTypes.stringOrFunc,
		keys: PropTypes.string,
		save: PropTypes.stringOrFunc,
		noQuery: PropTypes.any,
		store: PropTypes.object,
		contextStore: PropTypes.object.isRequired,
		title: PropTypes.node,
		width: PropTypes.stringOrNumber,
		header: PropTypes.component,
		footer: PropTypes.component,
		toolbar: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
		modalFooter: PropTypes.component,
	};

	static defaultProps = {
		fetch: 'fetch',
		save: 'request',
		noQuery: false,
		title: 'Reference',
		width: 800,
		toolbar: false,
	};

	constructor(props, context) {
		super(props, context);
		const { fetch, store: refStore } = props;
		isFunction(fetch) ? fetch(props) : refStore.call(fetch, props);
	}

	_handleOk = () => {
		const {
			props,
			props: { keys, save, store: refStore, contextStore },
		} = this;
		const { pathname } = refStore;
		const refKeys = refStore.selectedKeys;
		const url = joinKeys(keys) + `/${pathname}/` + joinKeys(refKeys);
		const options = { method: 'POST', url, ...props, keys, refKeys, refStore };
		isFunction(save) ? save(options) : contextStore.call(save, options);
	};

	_renderToolbar() {
		const { toolbar } = this.props;
		if (!toolbar) return null;
		return toolbar === true ? <DefaultToolbar /> : toolbar;
	}

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
				{Header && <Header store={store} />}
				{!noQuery && <TableQuery store={store} />}
				{this._renderToolbar()}
				<TableBody store={store} selectionType="radio" />
				{Footer && <Footer store={store} />}
			</ModalConsumer>
		);
	}
}
