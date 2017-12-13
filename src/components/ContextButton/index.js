
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import withActions from 'utils/withActions';
import { Button } from 'antd';
import LinkButton from 'components/LinkButton';
import { TOOLBAR } from 'constants/Issuers';

@withActions
export default class ContextButton extends Component {
	static propTypes = {
		children: PropTypes.node,
		label: PropTypes.node,
		multiLabel: PropTypes.node,
		actions: PropTypes.shape({
			selectedKeys: PropTypes.array.isRequired,
		}).isRequired,
		component: PropTypes.component,
		minSelected: PropTypes.number,
		maxSelected: PropTypes.number,
		onClick: PropTypes.func,
	};

	static defaultProps = {
		type: 'primary',
		component: LinkButton,
		minSelected: 0,
		maxSelected: Infinity,
	};

	static contextTypes = {
		issuer: PropTypes.string,
	};

	_handleClick = (ev) => {
		const { onClick, actions } = this.props;
		if (onClick) {
			onClick(ev, actions);
		}
	};

	render() {
		const {
			props: {
				actions: { selectedKeys },
				component, children, label, multiLabel,
				minSelected, maxSelected,
				...other,
			},
			context: { issuer },
		} = this;

		const selected = selectedKeys.length;
		const disabled = (minSelected > selected) || (maxSelected < selected);
		const isInToolbar = issuer === TOOLBAR;
		const Comp = isInToolbar ? Button : component;

		return (
			<Comp
				disabled={disabled}
				{...other}
				onClick={this._handleClick}
			>
				{children || (minSelected && (selected > 1) ? multiLabel : label)}
			</Comp>
		);
	}
}
