import styles from './styles';
import React, { Component } from 'react';
import { createRef } from 'utils/reactPolyfill';
import PropTypes from 'utils/PropTypes';
import { observer } from 'mobx-react';
import warning from 'warning';
import { isFunction } from 'utils/fp';
import routerStore from 'stores/routerStore';
import localize from 'hocs/localize';
import withTable from 'hocs/withTable';
import withIssuer from 'hocs/withIssuer';
import withStore from 'hocs/withStore';
import { Submit } from 'components/Form';
import PageTitle from 'components/PageTitle';
import FormBody from 'components/FormBody';
import { CREATER } from 'utils/Issuers';
import { message } from 'antd';
import { ModalProvider } from 'components/Modal';

export default function createFormDetailView(
	defaultTitle,
	issuer,
	displayName
) {
	const isCreater = issuer === CREATER;

	@localize('FormPage')
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
			pageTitle: PropTypes.string,
			header: PropTypes.component,
			footer: PropTypes.component,
			localeStore: PropTypes.object.isRequired,
		};

		static defaultProps = {
			save: isCreater ? 'create' : 'update',
		};

		state = {
			isOk: false,
			isSubmitting: false,
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

		_handleStatusChange = (isOk) => {
			if (this.state.isOk !== isOk) {
				this.setState({ isOk });
			}
		};

		_handleSubmit = async (body, state, { selectedKeys }) => {
			this.setState({ isSubmitting: true });
			const { props } = this;
			const { save, store, localeStore } = props;
			try {
				const reqParams = {
					...props,
					url: selectedKeys,
					body,
					refresh: false,
					throwError: true,
				};
				const responseData = isFunction(save) ?
					await save(reqParams) :
					await store.call(save, reqParams);
				this.setState({ isSubmitting: false });
				message.info(localeStore.data.successful);
				if (isCreater) {
					this._redirectToUpdate(store, responseData);
				}
			} catch (err) {
				this.setState({ isSubmitting: false });
				message.error(localeStore.data.failed);
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
				props: {
					store,
					header: Header,
					footer: Footer,
					match,
					pageTitle,
					localeStore,
				},
				state: { isSubmitting, isOk },
			} = this;
			const title = localeStore.localizeProp(pageTitle, defaultTitle);
			return (
				<ModalProvider>
					<div style={styles.container}>
						{Header ? (
							<Header title={title} store={store} />
						) : (
							<PageTitle title={title} />
						)}

						<FormBody
							ref={this.formRef}
							selectedKeys={match.params.key}
							value={isCreater ? this._createrValue : store.getData()}
							store={store}
							onSubmit={this._handleSubmit}
							onStatusChange={this._handleStatusChange}
							layout="vertical"
							footer={
								<Submit
									disabled={!isOk}
									type="primary"
									size="large"
									loading={isSubmitting}
								>
									{localeStore.data.submit}
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
