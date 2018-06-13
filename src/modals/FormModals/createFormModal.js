import React, { Component } from 'react';
import { createRef } from 'utils/reactPolyfill';
import PropTypes from 'utils/PropTypes';
import { observer } from 'mobx-react';
import warning from 'warning';
import withTable from 'hocs/withTable';
import styles from './styles';
import withIssuer from 'hocs/withIssuer';
import withStore from 'hocs/withStore';
import { Spin } from 'antd';
import { Form } from 'components/Form';
import ModalConsumer from 'components/ModalConsumer';
import FormItem from './FormItem';
import joinKeys from 'utils/joinKeys';
import { CREATER } from 'utils/Issuers';
import FormStore from 'stores/FormStore';

export default function createFormModal(defaultTitle, issuerText, displayName) {
	@withTable()
	@withStore({ prop: 'contextStore' })
	@withIssuer({ issuer: issuerText })
	@observer
	class FormModalView extends Component {
		static displayName = displayName;

		static propTypes = {
			contextStore: PropTypes.object.isRequired,
			store: PropTypes.object,
			table: PropTypes.string,
			keys: PropTypes.string,
			save: PropTypes.string,
			title: PropTypes.node,
			width: PropTypes.stringOrNumber,
		};

		static defaultProps = {
			title: defaultTitle,
			width: 800,
		};

		formRef = createRef();
		modalRef = createRef();
		formStore = new FormStore();

		constructor(props) {
			super(props);

			const { store, keys } = props;
			const selectedKeys = (keys || '').split(',');
			this._dataValue =
				issuerText === CREATER ? {} : store.getData(selectedKeys[0]);
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

		_handleChange = ({ value }) => {
			this.formStore.setState(value);
		};

		_handleSubmit = (body, { isInvalid }) => {
			if (!isInvalid) {
				const { props } = this;
				const store = props.store || props.contextStore;
				const { keys, save } = props;
				const url = joinKeys(keys);
				const method = save || (issuerText === CREATER ? 'create' : 'update');
				store.call(method, { ...props, url, body });
				this.modalRef.current.close();
			} else if (__DEV__) {
				warning(false, 'INVALID');
			}
		};

		render() {
			const {
				props: { store, contextStore, title, width },
				formStore,
				_dataValue,
			} = this;
			const { isFetching, renderers } = store || contextStore;
			return (
				<ModalConsumer
					title={title}
					width={width}
					onOk={this._handleOk}
					ref={this.modalRef}
				>
					<Form
						ref={this.formRef}
						value={_dataValue}
						onSubmit={this._handleSubmit}
						onChange={this._handleChange}
					>
						{isFetching && (
							<div style={styles.spinContainer}>
								<Spin />
							</div>
						)}
						{!isFetching &&
							renderers.map(({ renderForm }, index) => (
								<FormItem
									renderForm={renderForm}
									formStore={formStore}
									key={index}
								/>
							))}
					</Form>
				</ModalConsumer>
			);
		}
	}

	return FormModalView;
}
