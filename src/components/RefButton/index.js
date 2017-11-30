
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import LinkButton from 'components/LinkButton';
import RefModal from 'components/RefModal';
import joinKeys from 'utils/joinKeys';
import routerStore from 'stores/routerStore';
import { omit } from 'lodash';

export default class RefButton extends Component {
	static propTypes = {
		children: PropTypes.node,
		label: PropTypes.node,
		requestMethod: PropTypes.oneOf([
			'POST', 'GET', 'DELETE', 'PUT', 'PATCH',
		]),
		onTransformRequest: PropTypes.func,
		onTransformBody: PropTypes.func,
		onTransformUrl: PropTypes.func,
		record: PropTypes.object, // Maybe provided by <Action />
	};

	static defaultProps = {
		label: '关联',
		requestMethod: 'POST',
	};

	static contextTypes = {
		store: PropTypes.object,
	};

	state = { visible: false };

	_handleClick = (ev) => {
		ev.preventDefault();
		const { props: { record } } = this;
		const { location } = routerStore;
		location.query = { ...location.query, _keys: record.id };
		this.setState({ visible: true });
	};

	_handleRequestHide = () => {
		this.setState({ visible: false });
		const { location } = routerStore;
		location.query = { ...omit(location.query, ['_keys']) };
	};

	_handleChange = (id) => {
		const {
			props: {
				requestMethod, record,
				onTransformBody, onTransformRequest, onTransformUrl,
			},
			context: { store },
		} = this;
		const { location } = routerStore;
		const body = { id };
		const keys = location.query._keys;
		const url = joinKeys(keys);
		const updater = {
			url: onTransformUrl ? onTransformUrl(url) : url,
			body: onTransformBody ? onTransformBody(body, record) : body,
			method: requestMethod,
		};
		store.update(onTransformRequest ? onTransformRequest(updater) : updater);
	};

	render() {
		const {
			state: { visible },
			props: {
				children, label,

				// ignores
				record, requestMethod,
				onTransformUrl, onTransformBody, onTransformRequest,

				...other,
			},
		} = this;

		return (
			<LinkButton onClick={this._handleClick}>
				{label || children}

				<RefModal
					{...other}
					visible={visible}
					onRequestHide={this._handleRequestHide}
					onChange={this._handleChange}
				/>
			</LinkButton>
		);
	}
}
