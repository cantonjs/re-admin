
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import ContextButton from 'components/ContextButton';
import { TOOLBAR } from 'constants/Issuers';

export default class RemoveButton extends Component {
	static propTypes = {
		label: PropTypes.node,
		multiLabel: PropTypes.node,
	};

	static defaultProps = {
		label: '删除',
		multiLabel: '批量删除',
	};

	static contextTypes = {
		issuer: PropTypes.string,
	};

	_handleClick = (ev, { requestRemove }) => {
		ev.preventDefault();
		requestRemove();
	};

	render() {
		const isInToolbar = this.context.issuer === TOOLBAR;
		const styleTypes = {};
		if (isInToolbar) { styleTypes.type = 'danger'; }
		return (
			<ContextButton
				onClick={this._handleClick}
				{...styleTypes}
				{...this.props}
				minSelected={1}
			/>
		);
	}
}
