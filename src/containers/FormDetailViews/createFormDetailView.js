import React, { Component } from 'react';
import { createRef } from 'utils/reactPolyfill';
import PropTypes from 'utils/PropTypes';
import { observer } from 'mobx-react';
import warning from 'warning';
import withTable from 'hocs/withTable';
import withIssuer from 'hocs/withIssuer';
import withStore from 'hocs/withStore';
import { Form, Submit } from 'components/Form';
import FormItem from 'components/FormItem';
import SpinBox from 'components/SpinBox';
import joinKeys from 'utils/joinKeys';
import { CREATER } from 'utils/Issuers';
import { message } from 'antd';
import FormStore from 'stores/FormStore';
import ModalProvider from 'components/ModalProvider';
import PageContainer from 'components/PageContainer';

export default function createFormDetailView(title, issuer, displayName) {
	@withTable()
	@withStore({ prop: 'contextStore' })
	@withIssuer({ issuer })
	@observer
	class FormDetailView extends Component {
		static displayName = displayName;

		static propTypes = {
			contextStore: PropTypes.object.isRequired,
			store: PropTypes.object,
			table: PropTypes.string,
			keys: PropTypes.string,
			save: PropTypes.string,
			title: PropTypes.node,
		};

		static defaultProps = {
			title,
		};

		state = {
			isValid: true,
			isSubmitting: false,
		};

		formRef = createRef();
		formStore = new FormStore();

		constructor(props) {
			super(props);
			const selectedKeys = (props.keys || '').split(',');
			this._selectedKey = selectedKeys[0];
			this._isCreater = issuer === CREATER;
			if (this._isCreater) this._createrValue = {};
		}

		_handleChange = ({ value }) => {
			this.formStore.setState(value);
		};

		_handleValidChange = (isValid) => {
			this.isValid = isValid;
			this.setState({ isValid });
		};

		_handleSubmit = async (body, { isInvalid }) => {
			if (!isInvalid) {
				this.setState({ isSubmitting: true });
				const { props } = this;
				const store = props.store || props.contextStore;
				const { keys, save } = props;
				const url = joinKeys(keys);
				const method = save || (issuer === CREATER ? 'create' : 'update');
				await store.call(method, { ...props, url, body, refresh: false });
				this.setState({ isSubmitting: false });

				// TODO: should add locale support
				message.info('Success!');
			} else if (__DEV__) {
				warning(false, 'INVALID');
			}
		};

		render() {
			const {
				props: { store, contextStore, title },
				state: { isValid, isSubmitting },
				formStore,
				_isCreater,
				_selectedKey,
			} = this;
			const { isFetching, renderers } = store || contextStore;

			return (
				<PageContainer title={title}>
					<ModalProvider>
						<div>
							<h1>{title}</h1>
							<Form
								ref={this.formRef}
								value={
									_isCreater ? this._createrValue : store.getData(_selectedKey)
								}
								onSubmit={this._handleSubmit}
								onChange={this._handleChange}
								onValidChange={this._handleValidChange}
								layout="vertical"
							>
								{isFetching && <SpinBox />}
								{!isFetching &&
									renderers.map(({ renderForm }, index) => (
										<FormItem
											renderForm={renderForm}
											formStore={formStore}
											key={index}
										/>
									))}
								<Submit disabled={!isValid || isSubmitting}>
									{isSubmitting ? 'Loading...' : 'Save'}
								</Submit>
							</Form>
						</div>
					</ModalProvider>
				</PageContainer>
			);
		}
	}

	return FormDetailView;
}
