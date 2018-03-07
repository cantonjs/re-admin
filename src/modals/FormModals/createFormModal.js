import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import warning from 'warning';
import dataStoreProvider from 'hoc/dataStoreProvider';
import { Spin } from 'antd';
import { Form } from 'components/Nested';
import ModalConsumer from 'components/ModalConsumer';
import FormItemWrapper from 'components/FormItemWrapper';
import joinKeys from 'utils/joinKeys';
import { CREATER } from 'constants/Issuers';

const styles = {
	spinContainer: {
		textAlign: 'center',
		padding: 40,
	},
};

class FormState {
	@observable data = {};
}

export default function createFormModal(defaultTitle, issuerText, displayName) {
	@dataStoreProvider()
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
			service: PropTypes.object.isRequired,
			issuer: PropTypes.instanceOf(Set),
		};

		static childContextTypes = {
			formState: PropTypes.object,
			issuer: PropTypes.instanceOf(Set),
		};

		getChildContext() {
			const issuer = this.context.issuer || new Set();
			issuer.add(issuerText);
			return {
				formState: this._formState,
				issuer,
			};
		}

		componentWillMount() {
			this._formState = new FormState();
		}

		componentWillUnmount() {
			const { issuer } = this.context;
			if (issuer) {
				issuer.delete(issuerText);
			}
		}

		_handleOk(ev) {
			if (this._form) {
				ev.preventDefault();
				this._form.submit();
			}
		}

		_handleChange = (data) => {
			this._formState.data = data;
		};

		_handleSubmit = (body, { isInvalid }) => {
			if (!isInvalid) {
				const { context: { service }, props } = this;
				const { keys, store, save } = props;
				const path = store ? `/${store.pathname}` : '';
				const url = joinKeys(keys) + path;
				const method = save || (issuerText === CREATER ? 'create' : 'update');
				service.call(method, { ...props, url, body });
				this.modal.close();
			} else if (__DEV__) {
				warning(false, 'INVALID');
			}
		};

		render() {
			const { props: { store, title, width }, context } = this;
			const { isFetching, formRenderers } = store || context.store;
			return (
				<ModalConsumer
					title={title}
					width={width}
					onOk={this._handleOk}
					ref={(c) => (this.modal = c)}
				>
					<Form
						ref={(c) => (this._form = c)}
						onSubmit={this._handleSubmit}
						onChange={this._handleChange}
					>
						{isFetching && (
							<div style={styles.spinContainer}>
								<Spin />
							</div>
						)}
						{!isFetching &&
							formRenderers.map((renderOptions, index) => (
								<FormItemWrapper
									renderOptions={renderOptions}
									withLayout
									key={index}
								/>
							))}
					</Form>
				</ModalConsumer>
			);
		}
	}

	return observer(FormModalView);
}
