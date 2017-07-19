
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withActions from 'utils/withActions';

@withActions
export default class UpdateAction extends Component {
	static propTypes = {
		recordKey: PropTypes.any,
		record: PropTypes.any,
		names: PropTypes.array,
		children: PropTypes.node,
		actions: PropTypes.shape({
			requestUpdate: PropTypes.func.isRequired,
		}).isRequired,
	};

	static defaultProps = {
		children: '更新',
		names: [],
	};

	_handleClick = (ev) => {
		ev.preventDefault();
		const { recordKey, actions, names } = this.props;
		actions.requestUpdate(recordKey, names);
	};

	render() {
		const {
			props: {

				record,
				recordKey,
				actions,
				names,

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
