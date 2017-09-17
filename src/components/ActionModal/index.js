
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import ActionModalInternal from './ActionModalInternal';
import { map, omit } from 'lodash';
import * as Actions from 'constants/Actions';
import * as Issuers from 'constants/Issuers';
import { returnsArgument } from 'empty-functions';
import routerStore from 'stores/routerStore';

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
export default class ActionModal extends Component {
	static propTypes = {
		store: PropTypes.object.isRequired,
	};

	static contextTypes = {
		store: PropTypes.object.isRequired,
	};

	static omitPaths = ['_action', '_keys', '_names'];

	static childContextTypes = {
		issuer: PropTypes.string,
	};

	getChildContext() {
		return { issuer: issuersMap[routerStore.location.query._action] };
	}

	close() {
		const { store } = this.context;
		const { location } = routerStore;
		location.query = { ...omit(location.query, ActionModal.omitPaths) };
		store.setSelectedKeys([]);
	}

	_handleOk = () => {
		if (this._form) { this._form.submit(); }
		else { this.close(); }
	};

	_handleCancel = () => {
		this.close();
	};

	_handleSubmit = (data, { isInvalid }) => {
		if (!isInvalid) {
			const { store } = this.props;
			const { _action, _keys } = routerStore.location.query;
			store[_action](data, _keys);
			this.close();
		}
		else if (__DEV__) {
			console.warn('INVALID');
		}
	};

	_saveForm = (form) => {
		if (form) { this._form = form; }
	};

	render() {
		const { props: { store: { formNodes } } } = this;
		const { query: { _action }, search } = routerStore.location;

		const title = actionLabelsMap[_action];
		const isVisible = actionNames.includes(_action);

		return (
			<ActionModalInternal
				ref={this._saveForm}
				search={search}
				visible={isVisible}
				title={title}
				onSubmit={this._handleSubmit}
				onOk={this._handleOk}
				onCancel={this._handleCancel}
			>
				{formNodes}
			</ActionModalInternal>
		);
	}
}

