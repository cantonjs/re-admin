
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import LinkButton from 'components/LinkButton';
import RefModal from 'components/RefModal';

export default class RefButton extends Component {
	static propTypes = {
		children: PropTypes.node,
		label: PropTypes.node,
		httpRequestMethod: PropTypes.oneOf([
			'POST', 'GET', 'PUT', 'PATCH', 'DELETE',
		]),
		httpRequestUrlPrefix: PropTypes.string,
		onTransformBody: PropTypes.func.isRequired,
		record: PropTypes.object, // Maybe provided by <Action />
	};

	static defaultProps = {
		label: '关联',
		httpRequestMethod: 'POST',
		httpRequestUrlPrefix: '',
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

	_handleChange = (id, store, routerStore) => {
		const {
			httpRequestMethod, httpRequestUrlPrefix, onTransformBody, record,
		} = this.props;
		const body = onTransformBody(id, record);
		const { _keys } = routerStore.location.query;
		this.context.store.update(body, {
			keys: _keys,
			method: httpRequestMethod,
			urlPrefix: httpRequestUrlPrefix,
		});
	};

	render() {
		const {
			state: { visible },
			props: {
				children, label,

				// ignores
				record, httpRequestMethod, httpRequestUrlPrefix, onTransformBody,

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
