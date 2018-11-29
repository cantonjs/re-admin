import PropTypes from 'utils/PropTypes';
import React, { Component } from 'react';
import joinKeys from 'utils/joinKeys';
import { REF } from 'utils/Issuers';
import { isFunction } from 'utils/fp';
import withTable from 'hocs/withTable';
import withIssuer from 'hocs/withIssuer';
import withStore from 'hocs/withStore';
import { ModalConsumer } from 'components/Modal';
import TableBody from 'components/TableBody';
import TableQuery from 'components/TableQuery';
import DefaultToolbar from 'components/DefaultToolbar';
import QueryConnector from 'components/QueryConnector';

@withStore({ prop: 'contextStore' })
@withTable()
@withStore()
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
		toolbar: PropTypes.oneOfType([PropTypes.component, PropTypes.bool]),
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
			props: { keys, save, store: refStore },
		} = this;
		const { pathname } = refStore;
		const refKeys = refStore.selectedKeys;
		const url = joinKeys(keys) + `/${pathname}/` + joinKeys(refKeys);
		const options = { method: 'POST', url, ...props, keys, refKeys, refStore };
		isFunction(save) ? save(options) : refStore.call(save, options);
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
			toolbar: ToolbarComponent,
		} = this.props;
		return (
			<QueryConnector store={store}>
				<ModalConsumer
					width={width}
					title={title}
					onOk={this._handleOk}
					footer={ModalFooter && <ModalFooter store={store} />}
				>
					{Header && <Header store={store} />}
					{!noQuery && <TableQuery store={store} />}
					{ToolbarComponent &&
						(ToolbarComponent === true ? (
							<DefaultToolbar />
						) : (
							<ToolbarComponent store={store} />
						))}
					<TableBody store={store} selectionType="radio" />
					{Footer && <Footer store={store} />}
				</ModalConsumer>
			</QueryConnector>
		);
	}
}
