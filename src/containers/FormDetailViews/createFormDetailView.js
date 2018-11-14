import styles from './styles';
import React, { Component } from 'react';
import { createRef } from 'utils/reactPolyfill';
import PropTypes from 'utils/PropTypes';
import { observer } from 'mobx-react';
import warning from 'warning';
import { isFunction } from 'lodash';
import routerStore from 'stores/routerStore';
import withTable from 'hocs/withTable';
import withIssuer from 'hocs/withIssuer';
import withStore from 'hocs/withStore';
import { Submit } from 'components/Form';
import FormBody from 'components/FormBody';
import joinKeys from 'utils/joinKeys';
import { CREATER } from 'utils/Issuers';
import { message } from 'antd';
import ModalProvider from 'components/ModalProvider';

export default function createFormDetailView(title, issuer, displayName) {
	const isCreater = issuer === CREATER;

	@withIssuer({ issuer })
	@withTable({ syncLocation: true, type: 'detail' })
	@withStore()
	@observer
	class FormDetailView extends Component {
		static displayName = displayName;

		static propTypes = {
			match: PropTypes.object.isRequired,
			store: PropTypes.object.isRequired,
			save: PropTypes.stringOrFunc,
			title: PropTypes.node,
			header: PropTypes.component,
			footer: PropTypes.component,
		};

		static defaultProps = {
			title,
			save: isCreater ? 'create' : 'update',
		};

		state = {
			isValid: true,
			isSubmitting: false,
			isPristine: true,
		};

		formRef = createRef();

		constructor(props) {
			super(props);

			const { store, match } = props;
			const selectedKeys = (match.params.key || '').split(',');
			if (isCreater) {
				this._createrValue = {};
			} else {
				store.setSelectedKeys(selectedKeys);
				store.call('fetch');
			}
		}

		_handleChange = () => {
			if (this.state.isPristine) {
				this.setState({ isPristine: false });
			}
		};

		_handleValidChange = (isValid) => {
			this.isValid = isValid;
			this.setState({ isValid });
		};

		_handleSubmit = async (body) => {
			this.setState({ isSubmitting: true });
			const { props } = this;
			const { match, save, store } = props;
			const selectedKeys = (match.params.key || '').split(',');
			const url = joinKeys(selectedKeys);
			try {
				const reqParams = {
					...props,
					url,
					body,
					refresh: false,
					throwError: true,
				};
				const responseData = isFunction(save) ?
					await save(reqParams) :
					await store.call(save, reqParams);
				this.setState({ isSubmitting: false, isPristine: true });

				// TODO: should add locale support
				message.info('Success!');

				if (isCreater) {
					this._redirectToUpdate(store, responseData);
				}
			} catch (err) {
				this.setState({ isSubmitting: false });
				message.error('Failed!');
				warning(false, err.message);
			}
		};

		_redirectToUpdate(store, responseData) {
			const { pathname, search } = routerStore.location;
			const { uniqueKey } = store.config;
			if (uniqueKey && responseData && responseData[uniqueKey]) {
				const key = responseData[uniqueKey];
				const newPathname = pathname.replace(/create$/, `update/${key}`);
				const path = newPathname + search;
				routerStore.replace(path);
			}
		}

		render() {
			const {
				props: { store, header: Header, footer: Footer },
				state: { isValid, isSubmitting, isPristine },
			} = this;
			return (
				<ModalProvider>
					<div style={styles.container}>
						{Header ? <Header title={title} store={store} /> : <h1>{title}</h1>}

						<FormBody
							ref={this.formRef}
							value={isCreater ? this._createrValue : store.getData()}
							store={store}
							onSubmit={this._handleSubmit}
							onChange={this._handleChange}
							onValidChange={this._handleValidChange}
							layout="vertical"
							footer={
								<Submit
									disabled={isPristine || !isValid || isSubmitting}
									type="primary"
									size="large"
									loading={isSubmitting}
								>
									Save
								</Submit>
							}
						/>
						{Footer && <Footer store={store} />}
					</div>
				</ModalProvider>
			);
		}
	}

	return FormDetailView;
}
