
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import ActionModalInternal from './ActionModalInternal';
import * as Actions from 'constants/Actions';
import { map, reduce } from 'lodash';

const actionNames = map(Actions, ({ name }) => name);
const actionLabelsMap = reduce(Actions, (map, { name, label }) => {
	map[name] = label;
	return map;
}, {});

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
		const { store, location: { query: { action } } } = this.props;
		console.log('err', err);
		console.log('submit values', values);
		store[action](values);
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

