
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Spin } from 'antd';
import { map, omit, isFunction } from 'lodash';
import { returnsArgument } from 'empty-functions';
import { Form } from 'components/Nested';
import FormItemWrapper from 'components/FormItemWrapper';
import routerStore from 'stores/routerStore';
import * as Actions from 'constants/Actions';
import * as Issuers from 'constants/Issuers';
import joinKeys from 'utils/joinKeys';

const styles = {
	spinContainer: {
		textAlign: 'center',
		padding: 40,
	},
};

class FormState {
	@observable data = {};
}

const issuersMap = {
	[Actions.CREATE]: Issuers.CREATER,
	[Actions.UPDATE]: Issuers.UPDATER,
};
const actionNames = map(Actions, returnsArgument);
const actionLabelsMap = {
	[Actions.CREATE]: '创建',
	[Actions.UPDATE]: '更新',
};

@observer
export default class FormModalInternal extends Component {
	static propTypes = {
		store: PropTypes.object.isRequired,
		form: PropTypes.object,
		title: PropTypes.string,
		issuerType: PropTypes.oneOf([Actions.CREATE, Actions.UPDATE]),
	};

	static childContextTypes = {
		formState: PropTypes.object,
		issuer: PropTypes.string,
	};

	static omitPaths = ['opt_action', 'opt_keys', 'opt_names'];

	getChildContext() {
		return {
			formState: this._formState,
			issuer: this.props.issuerType,
		};
	}

	componentWillMount() {
		this._formState = new FormState();
	}

	_saveForm = (form) => {
		if (form) { this._form = form; }
	};

	_handleChange = (data) => {
		this._formState.data = data;
	};

	close() {
		const { store } = this.props;
		const { location } = routerStore;
		location.query = { ...omit(location.query, FormModalInternal.omitPaths) };
		store.setSelectedKeys([]);
	}

	handleOk = () => {
		if (this._form) { this._form.submit(); }
		else { this.close(); }
	};

	handleCancel = () => {
		this.close();
	};

	_handleSubmit = (body, { isInvalid }) => {
		if (!isInvalid) {
			const { store } = this.props;
			const { _action, _keys } = routerStore.location.query;
			const isValidRequest = isFunction(store[_action]);

			if (isValidRequest) {
				const keys = _keys || store.selectedKeys;
				const url = joinKeys(keys);
				store[_action]({ url, body });
			}

			this.close();
		}
		else if (__DEV__) {
			console.warn('INVALID');
		}
	};

	render() {
		const {
			props: {
				store: { isFetching, formRenderers },
			},
		} = this;

		return (
			<Form
				ref={this._saveForm}
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

