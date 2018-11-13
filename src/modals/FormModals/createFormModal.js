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
	const isCreater = issuer === CREATER;

	@withTable()
	@withStore()
	@withIssuer({ issuer })
	@observer
	class FormModalView extends Component {
		static displayName = displayName;

		static propTypes = {
			store: PropTypes.object.isRequired,
			table: PropTypes.string,
			keys: PropTypes.string,
			save: PropTypes.stringOrFunc,
			title: PropTypes.node,
			width: PropTypes.stringOrNumber,
		};

		static defaultProps = {
			title: defaultTitle,
			width: 800,
			save: isCreater ? 'create' : 'update',
		};

		formRef = createRef();
		modalRef = createRef();

		constructor(props) {
			super(props);

			const { keys, store } = props;
			const selectedKeys = (keys || '').split(',');
			this._selectedKey = selectedKeys[0];
			if (isCreater) this._createrValue = {};
			else {
				store.setSelectedKeys(selectedKeys);
				store.call('fetch');
			}
		}

		_handleOk = (ev) => {
			const form = this.formRef.current;
			if (!form) return;
			ev.preventDefault();
			const { isValid } = form.getValidState();
			if (isValid) {
				const { store } = this.props;
				form.submit();
				store.setSelectedKeys([]);
			}
		};

		_handleSubmit = (body) => {
			const { props } = this;
			const { keys, save, store } = props;
			const url = joinKeys(keys);
			const options = { ...props, url, body };
			isFunction(save) ? save(options) : store.call(save, options);
			this.modalRef.current.close();
		};

		render() {
			const { props: { store, title, width }, _selectedKey } = this;
			return (
				<ModalConsumer
					title={title}
					width={width}
					onOk={this._handleOk}
					ref={this.modalRef}
				>
					<FormBody
						value={isCreater ? this._createrValue : store.getData(_selectedKey)}
						formRef={this.formRef}
						store={store}
						onSubmit={this._handleSubmit}
					/>
				</ModalConsumer>
			);
		}
	}

	return FormModalView;
}
