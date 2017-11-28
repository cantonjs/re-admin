
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import { propTypes as MobxPropTypes } from 'mobx-react';
import withActions from 'utils/withActions';
import { Button } from 'antd';
import LinkButton from 'components/LinkButton';
import { TOOLBAR } from 'constants/Issuers';

@withActions
export default class RemoveButton extends Component {
	static propTypes = {
		children: PropTypes.node,
		recordKeys: PropTypes.array,
		label: PropTypes.node,
		multiLabel: PropTypes.node,
		actions: PropTypes.shape({
			requestRemove: PropTypes.func.isRequired,
			selectedKeys: MobxPropTypes.observableArray.isRequired,
		}).isRequired,
		component: PropTypes.component,
		record: PropTypes.object, // Maybe provided by <Action />
	};

	static defaultProps = {
		label: '删除',
		multiLabel: '批量删除',
		recordKeys: [],
		component: LinkButton,
	};

	static contextTypes = {
		issuer: PropTypes.string,
	};

	static LinkButton = LinkButton;

	_handleClick = (ev) => {
		ev.preventDefault();
		const { recordKeys, actions } = this.props;
		actions.requestRemove(recordKeys);
	};

	render() {
		const {
			props: {
				actions: { selectedKeys },
				component, recordKeys, children, label, multiLabel,
				record, // ignores
				...other,
			},
			context: { issuer },
		} = this;

		const selectedLength = recordKeys.length || selectedKeys.length;
		const isInToolbar = issuer === TOOLBAR;
		const Comp = isInToolbar ? Button : component;
		const styleTypes = {};
		if (Comp.name === 'Button') { styleTypes.type = 'danger'; }

		return (
			<Comp
				onClick={this._handleClick}
				{...styleTypes}
				{...other}
				disabled={!selectedLength}
			>
				{(selectedLength > 1 ? multiLabel : label) || children}
			</Comp>
		);
	}
}
