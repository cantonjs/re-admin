
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import ContextButton from 'components/ContextButton';

export default class UpdateButton extends Component {
	static propTypes = {
		names: PropTypes.array,
		label: PropTypes.node,
		multiLabel: PropTypes.node,
	};

	static defaultProps = {
		label: '修改',
		multiLabel: '批量修改',
		names: [],
	};

	_handleClick = (ev, { openUpdaterModal }) => {
		ev.preventDefault();
		openUpdaterModal({ select: this.props.names });
	};

	render() {
		const {
			props: { names, ...other },
		} = this;

		return (
			<ContextButton
				{...other}
				onClick={this._handleClick}
				minSelected={1}
			/>
		);
	}
}
