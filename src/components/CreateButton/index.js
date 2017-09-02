
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import withActions from 'utils/withActions';
import { Button } from 'antd';
import LinkButton from 'components/LinkButton';
import { TOOLBAR } from 'constants/Issuers';

@withActions
export default class CreateButton extends Component {
	static propTypes = {
		children: PropTypes.node,
		label: PropTypes.node,
		actions: PropTypes.shape({
			requestCreate: PropTypes.func.isRequired,
		}).isRequired,
		component: PropTypes.component,
	};

	static defaultProps = {
		label: '新建',
		type: 'primary',
		component: LinkButton,
	};

	static contextTypes = {
		issuer: PropTypes.string,
	};

	static LinkButton = LinkButton;

	_handleClick = (ev) => {
		ev.preventDefault();
		this.props.actions.requestCreate();
	};

	render() {
		const {
			props: { component, children, label, actions, ...other },
			context: { issuer },
		} = this;

		const isInToolbar = issuer === TOOLBAR;
		const Comp = isInToolbar ? Button : component;

		return (
			<Comp
				onClick={this._handleClick}
				{...other}
			>
				{label || children}
			</Comp>
		);
	}
}
