import React, { Component } from 'react';
import { createRef } from 'create-react-ref';
import PropTypes from 'utils/PropTypes';
import { observer } from 'mobx-react';
import warning from 'warning';
import connect from 'hoc/connect';
import styles from './styles';
import withIssuer from 'hoc/withIssuer';
import { Spin } from 'antd';
import { Form } from 'components/Nested';
import ModalConsumer from 'components/ModalConsumer';
import FormItem from './FormItem';
import joinKeys from 'utils/joinKeys';
import { CREATER } from 'utils/Issuers';
import FormStore from 'stores/FormStore';

export default function createFormModal(defaultTitle, issuerText, displayName) {
	@withIssuer({ issuer: issuerText })
	@connect()
	@observer
	class FormModalView extends Component {
		static displayName = displayName;

		static propTypes = {
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

		static contextTypes = {
			store: PropTypes.object.isRequired,
		};

		formRef = createRef();
		modalRef = createRef();
		formStore = new FormStore();

		_handleOk = (ev) => {
			if (this.formRef.current) {
				ev.preventDefault();
				this.formRef.current.submit();
			}
		};

		_handleChange = (state) => {
			this.formStore.setState(state);
		};

		_handleSubmit = (body, { isInvalid }) => {
			if (!isInvalid) {
				const { context, props } = this;
				const { keys, save } = props;
				const store = props.store || context.store;
				const path = store ? `/${store.pathname}` : '';
				const url = joinKeys(keys) + path;
				const method = save || (issuerText === CREATER ? 'create' : 'update');
				store.call(method, { ...props, url, body });
				this.modalRef.current.close();
			} else if (__DEV__) {
				warning(false, 'INVALID');
			}
		};

		render() {
			const { props: { store, title, width }, context, formStore } = this;
			const { isFetching, renderers } = store || context.store;
			return (
				<ModalConsumer
					title={title}
					width={width}
					onOk={this._handleOk}
					ref={this.modalRef}
				>
					<Form
						ref={this.formRef}
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
