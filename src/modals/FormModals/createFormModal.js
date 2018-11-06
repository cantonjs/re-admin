import React, { Component } from 'react';
import { createRef } from 'utils/reactPolyfill';
import PropTypes from 'utils/PropTypes';
import joinKeys from 'utils/joinKeys';
import { CREATER } from 'utils/Issuers';
import { isFunction } from 'lodash';
import { observer } from 'mobx-react';
import withTable from 'hocs/withTable';
import withIssuer from 'hocs/withIssuer';
import withStore from 'hocs/withStore';
import ModalConsumer from 'components/ModalConsumer';
import FormBody from 'components/FormBody';

export default function createFormModal(defaultTitle, issuer, displayName) {
	@withTable()
	@withStore({ prop: 'contextStore' })
	@withIssuer({ issuer })
	@observer
	class FormModalView extends Component {
		static displayName = displayName;

		static propTypes = {
			contextStore: PropTypes.object.isRequired,
			store: PropTypes.object,
			table: PropTypes.string,
			keys: PropTypes.string,
			save: PropTypes.stringOrFunc,
			title: PropTypes.node,
			width: PropTypes.stringOrNumber,
		};

		static defaultProps = {
			title: defaultTitle,
			width: 800,
		};

		formRef = createRef();
		modalRef = createRef();

		constructor(props) {
			super(props);

			const selectedKeys = (props.keys || '').split(',');
			this._selectedKey = selectedKeys[0];
			this._isCreater = issuer === CREATER;
			if (this._isCreater) this._createrValue = {};
		}

		_handleOk = (ev) => {
			const form = this.formRef.current;
			if (!form) return;
			ev.preventDefault();
			const { isValid } = form.getValidState();
			if (isValid) {
				const { props } = this;
				const store = props.store || props.contextStore;
				form.submit();
				store.setSelectedKeys([]);
			}
		};

		_handleSubmit = (body) => {
			const { props } = this;
			const store = props.store || props.contextStore;
			const { keys, save } = props;
			const url = joinKeys(keys);
			const method = save || (issuer === CREATER ? 'create' : 'update');
			const options = { ...props, url, body };
			isFunction(method) ? method(options) : store.call(method, options);
			this.modalRef.current.close();
		};

		render() {
			const {
				props: { store, contextStore, title, width },
				_isCreater,
				_selectedKey,
			} = this;
			return (
				<ModalConsumer
					title={title}
					width={width}
					onOk={this._handleOk}
					ref={this.modalRef}
				>
					<FormBody
						value={
							_isCreater ? this._createrValue : store.getData(_selectedKey)
						}
						formRef={this.formRef}
						store={store || contextStore}
						onSubmit={this._handleSubmit}
					/>
				</ModalConsumer>
			);
		}
	}

	return FormModalView;
}
