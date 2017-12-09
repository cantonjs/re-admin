
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Spin } from 'antd';
import { Form } from 'components/Nested';
import FormItemWrapper from 'components/FormItemWrapper';
import joinKeys from 'utils/joinKeys';
import * as Issuers from 'constants/Issuers';

const styles = {
	spinContainer: {
		textAlign: 'center',
		padding: 40,
	},
};

class FormState {
	@observable data = {};
}

export default function createFormModal(issuer, displayName) {
	class FormModalView extends Component {
		static displayName = displayName;

		static contextTypes = {
			store: PropTypes.object.isRequired,
			modalStore: PropTypes.object.isRequired,
		};

		static childContextTypes = {
			formState: PropTypes.object,
			issuer: PropTypes.string,
		};

		getChildContext() {
			return {
				formState: this._formState,
				issuer,
			};
		}

		componentWillMount() {
			this.context.modalStore.onOk(() => {
				if (this._form) { this._form.submit(); }
			});
			this._formState = new FormState();
		}

		componentWillUnmount() {
			this.context.modalStore.offOk();
		}

		_handleChange = (data) => {
			this._formState.data = data;
		};

		_handleSubmit = (body, { isInvalid }) => {
			if (!isInvalid) {
				const { store, modalStore } = this.context;
				const { keys } = modalStore.state;
				const url = joinKeys(keys);
				const method = issuer === Issuers.CREATER ? 'create' : 'update';
				store[method]({ url, body });
				modalStore.close();
			}
			else if (__DEV__) {
				console.warn('INVALID');
			}
		};

		render() {
			const {
				context: {
					store: { isFetching, formRenderers },
				},
			} = this;

			return (
				<Form
					ref={(c) => (this._form = c)}
					onSubmit={this._handleSubmit}
					onChange={this._handleChange}
				>
					{isFetching &&
						<div style={styles.spinContainer}>
							<Spin />
						</div>
					}
					{!isFetching && formRenderers.map((renderOptions, index) =>
						<FormItemWrapper
							renderOptions={renderOptions}
							withLayout
							key={index}
						/>
					)}
				</Form>
			);
		}
	}

	return observer(FormModalView);
}
