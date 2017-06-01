
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withActions from 'utils/withActions';

@withActions
export default class RemoveAction extends Component {
	static propTypes = {
		recordKey: PropTypes.any.isRequired,
		children: PropTypes.node,
		actions: PropTypes.shape({
			requestRemove: PropTypes.func.isRequired,
		}).isRequired,
	};

	static defaultProps = {
		children: '删除',
	};

	_handleClick = (ev) => {
		ev.preventDefault();
		const { recordKey, actions } = this.props;
		actions.requestRemove(recordKey);
	};

	render() {
		const {
			props: {
				actions,
				recordKey,

				children,
				...other,
			},
		} = this;
		return (
			<a
				href="#"
				onClick={this._handleClick}
				{...other}
			>
				{children}
			</a>
		);
	}
}
