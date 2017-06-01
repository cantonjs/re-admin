
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import ActionModalInternal from './ActionModalInternal';
import { map } from 'lodash';
import * as Actions from 'constants/Actions';
import * as Issuers from 'constants/Issuers';
import { returnsArgument } from 'empty-functions';

const issuersMap = {
	[Actions.CREATE]: Issuers.CREATER,
	[Actions.UPDATE]: Issuers.UPDATER,
};
const actionNames = map(Actions, returnsArgument);
const actionLabelsMap = {
	[Actions.CREATE]: '创建',
	[Actions.UPDATE]: '更新',
	// [Actions.REMOVE]: '删除',
};

@observer
export default class ActionModal extends Component {
	static propTypes = {
		children: PropTypes.node,
		store: PropTypes.object.isRequired,
		location: PropTypes.shape({
			query: PropTypes.object,
			pathname: PropTypes.string,
		}).isRequired,
	};

	static contextTypes = {
		store: PropTypes.object.isRequired,
		updateLocationQuery: PropTypes.func.isRequired,
	};

	static childContextTypes = {
		issuer: PropTypes.string,
	};

	getChildContext() {
		return { issuer: issuersMap[this.props.location.query._action] };
	}

	close() {
		const { updateLocationQuery, store } = this.context;
		updateLocationQuery({}, {
			omitPaths: ['_action', '_keys', '_names'],
		});
		store.setSelectedKeys([]);
	}

	_handleOk = () => {
		if (this._form) {
			this._form.validateFields((err, values) => {
				this._handleSubmit(err, values);
				if (!err) { this.close(); }
			});
		}
		else {
			this.close();
		}
	};

	_handleCancel = () => {
		this.close();
	};

	_handleSubmit = (err, values) => {
		if (!err) {
			const { store, location: { query: { _action, _keys } } } = this.props;
			store[_action](values, _keys);
		}
	};

	_saveForm = (form) => {
		if (form) { this._form = form; }
	}

	render() {
		const {
			props: {
				children,
				location: { query: { _action }, search }
			},
		} = this;

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
				{children}
			</ActionModalInternal>
		);
	}
}

