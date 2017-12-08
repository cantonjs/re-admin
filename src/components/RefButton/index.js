
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import RefModal from 'components/RefModal';
import joinKeys from 'utils/joinKeys';
import routerStore from 'stores/routerStore';
import { omit } from 'lodash';
import ContextButton from 'components/ContextButton';

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
		const { _contextButton } = this;
		const { location } = routerStore;
		location.query = {
			...location.query,
			_keys: joinKeys(_contextButton.getSelectedKeys()),
		};
		this.setState({ visible: true });
	};

	_handleRequestHide = () => {
		this.setState({ visible: false });
		const { location } = routerStore;
		location.query = { ...omit(location.query, ['_keys']) };
	};

	_handleChange = (refId) => {
		const {
			props: {
				requestMethod,
				onTransformBody, onTransformRequest, onTransformUrl,
			},
			context: { store },
			_contextButton,
		} = this;
		const { location } = routerStore;
		const body = { refId, keys: _contextButton.getSelectedKeys() };
		const keys = location.query._keys;
		const url = joinKeys(keys);
		const updater = {
			url: onTransformUrl ? onTransformUrl(url) : url,
			body: onTransformBody ? onTransformBody(body) : body,
			method: requestMethod,
		};
		store.update(onTransformRequest ? onTransformRequest(updater) : updater);
	};

	render() {
		const {
			state: { visible },
			props: {
				children, label,

				requestMethod, onTransformUrl, onTransformBody, onTransformRequest,

				...other,
			},
		} = this;

		return (
			<ContextButton
				ref={(contextButton) => (this._contextButton = contextButton)}
				onClick={this._handleClick}
			>
				{label || children}

				<RefModal
					{...other}
					visible={visible}
					onRequestHide={this._handleRequestHide}
					onChange={this._handleChange}
				/>
			</ContextButton>
		);
	}
}
