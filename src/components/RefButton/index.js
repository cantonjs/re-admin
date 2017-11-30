
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import LinkButton from 'components/LinkButton';
import RefModal from 'components/RefModal';
import joinKeys from 'utils/joinKeys';

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
		this.setState({ visible: true });
	};

	_handleRequestHide = () => {
		this.setState({ visible: false });
	};

	_handleChange = (id, routerStore) => {
		const {
			props: {
				requestMethod, record,
				onTransformBody, onTransformRequest, onTransformUrl,
			},
			context: { store },
		} = this;
		const body = { id };
		const { _keys } = routerStore.location.query;
		const keys = _keys || store.selectedKeys;
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
