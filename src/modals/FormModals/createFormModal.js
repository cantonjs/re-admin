import React, { Component } from 'react';
import { createRef } from 'utils/reactPolyfill';
import PropTypes from 'utils/PropTypes';
import joinKeys from 'utils/joinKeys';
import { CREATER } from 'utils/Issuers';
import { isFunction } from 'utils/fp';
import { observer } from 'mobx-react';
import withTable from 'hocs/withTable';
import withIssuer from 'hocs/withIssuer';
import withStore from 'hocs/withStore';
import { ModalConsumer } from 'components/Modal';
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
			names: PropTypes.array,
		};

		static defaultProps = {
			title: defaultTitle,
			width: 800,
			save: isCreater ? 'create' : 'update',
			names: [],
		};

		state = {
			isOk: false,
		};

		formRef = createRef();
		modalRef = createRef();

		constructor(props) {
			super(props);

			const { store, keys, names } = props;
			if (names.length) {
				store.setSelectedNames(names);
			}
			if (isCreater) this._createrValue = {};
			else {
				const selectedKeys = (keys || '').split(',');
				store.setSelectedKeys(selectedKeys);
				store.call('fetch');
			}
		}

		componentWillUnmount() {
			this.props.store.clearSelectedNames();
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

		_handleSubmit = (body, state, { selectedKeys }) => {
			const { props } = this;
			const { save, store } = props;
			const options = { ...props, url: selectedKeys, body };
			isFunction(save) ? save(options) : store.call(save, options);
			this.modalRef.current.close();
		};

		_handleStatusChange = (isOk) => {
			if (this.state.isOk !== isOk) {
				this.setState({ isOk });
			}
		};

		render() {
			const {
				props: { store, title, width, keys },
				state: { isOk },
			} = this;
			return (
				<ModalConsumer
					title={title}
					width={width}
					okButtonProps={{ disabled: !isOk }}
					onOk={this._handleOk}
					ref={this.modalRef}
				>
					<FormBody
						value={isCreater ? this._createrValue : store.getData(keys)}
						formRef={this.formRef}
						store={store}
						selectedKeys={joinKeys(keys)}
						onStatusChange={this._handleStatusChange}
						onSubmit={this._handleSubmit}
					/>
				</ModalConsumer>
			);
		}
	}

	return FormModalView;
}
