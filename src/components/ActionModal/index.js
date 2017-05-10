
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
		return { issuer: issuersMap[this.props.location.query.action] };
	}

	close() {
		this.context.updateLocationQuery({}, {
			omitPaths: ['action', 'selectedKeys'],
		});
	}

	_handleOk = () => {
		if (this._form) {
			this._form.validateFields((err, values) => {
				this._handleSubmit(err, values);
			});
		}
		this.close();
	};

	_handleCancel = () => {
		this.close();
	};

	_handleSubmit = (err, values) => {
		if (!err) {
			const { store, location: { query: { action } } } = this.props;
			console.log('submit values', values);
			store[action](values);
		}
	};

	_saveForm = (form) => {
		if (form) { this._form = form; }
	}

	render() {
		const {
			props: {
				children,
				location: { query: { action } }
			},
		} = this;

		const title = actionLabelsMap[action];

		return (
			<ActionModalInternal
				ref={this._saveForm}
				visible={actionNames.includes(action)}
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

