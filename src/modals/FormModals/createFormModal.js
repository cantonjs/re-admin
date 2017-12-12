
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Spin } from 'antd';
import { Form } from 'components/Nested';
import FormItemWrapper from 'components/FormItemWrapper';
import joinKeys from 'utils/joinKeys';
import { CREATER } from 'constants/Issuers';
import DataStore from 'stores/DataStore';

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
			this._formState = new FormState();
		}

		handleOk() {
			if (this._form) { this._form.submit(); }
		}

		_handleChange = (data) => {
			this._formState.data = data;
		};

		_handleSubmit = (body, { isInvalid }) => {
			if (!isInvalid) {
				const { store, modalStore } = this.context;
				const { state, state: { keys, table, save } } = modalStore;
				const path = table ? `/${DataStore.get(table).pathname}` : '';
				const url = joinKeys(keys) + path;
				const saveMethod = save || (issuer === CREATER ? 'create' : 'update');
				store[saveMethod]({ url, body, state });
				modalStore.close();
			}
			else if (__DEV__) {
				console.warn('INVALID');
			}
		};

		render() {
			const {
				context: {
					store,
					modalStore: { state: { table } },
				},
			} = this;

			const dataStore = table ? DataStore.get(table) : store;
			const { isFetching, formRenderers } = dataStore;

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
