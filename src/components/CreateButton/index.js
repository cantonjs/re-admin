
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import ContextButton from 'components/ContextButton';

export default class CreateButton extends Component {
	static propTypes = {
		label: PropTypes.node,
	};

	static defaultProps = {
		label: '新建',
	};

	_handleClick = (ev, { requestCreate }) => {
		ev.preventDefault();
		requestCreate();
	};

	render() {
		return (
			<ContextButton
				onClick={this._handleClick}
				{...this.props}
			/>
		);
	}
}
