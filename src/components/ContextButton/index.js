import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import withActions from 'hocs/withActions';
import withIssuer from 'hocs/withIssuer';
import { Button } from 'antd';
import LinkButton from 'components/LinkButton';
import { TABLE } from 'utils/Issuers';
import { isFunction } from 'lodash';

@withIssuer()
@withActions
export default class ContextButton extends Component {
	static propTypes = {
		children: PropTypes.nodeOrFunc,
		label: PropTypes.stringOrFunc,
		multiLabel: PropTypes.stringOrFunc,
		actions: PropTypes.shape({
			selectedKeys: PropTypes.array.isRequired,
		}).isRequired,
		component: PropTypes.component,
		minSelected: PropTypes.number,
		maxSelected: PropTypes.number,
		method: PropTypes.string,
		issuers: PropTypes.instanceOf(Set).isRequired,
		onClick: PropTypes.func,
	};

	static defaultProps = {
		type: 'primary',
		component: LinkButton,
		minSelected: 0,
		maxSelected: Infinity,
	};

	_handleClick = (ev) => {
		const { onClick, method, actions } = this.props;
		if (onClick) {
			onClick(ev, actions);
		}
		if (method) {
			ev.preventDefault();
			actions.store.call(method, {
				method: 'POST',
				keys: actions.selectedKeys,
			});
		}
	};

	render() {
		const {
			props: {
				actions: { selectedKeys, getData },
				component,
				children,
				label,
				multiLabel,
				minSelected,
				maxSelected,
				issuers,
				method,
				...other
			},
		} = this;

		const selected = selectedKeys.length;
		const disabled = minSelected > selected || maxSelected < selected;
		const Comp = issuers.has(TABLE) ? component : Button;
		const renderChild =
			children ||
			(minSelected && selected > 1 && multiLabel ? multiLabel : label);

		return (
			<Comp disabled={disabled} {...other} onClick={this._handleClick}>
				{isFunction(renderChild) ? renderChild(getData() || {}) : renderChild}
			</Comp>
		);
	}
}
