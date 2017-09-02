
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import { propTypes as MobxPropTypes } from 'mobx-react';
import withActions from 'utils/withActions';
import { Button } from 'antd';
import LinkButton from 'components/LinkButton';
import { TOOLBAR } from 'constants/Issuers';

@withActions
export default class UpdateButton extends Component {
	static propTypes = {
		children: PropTypes.node,
		recordKeys: PropTypes.array,
		names: PropTypes.array,
		label: PropTypes.node,
		multiLabel: PropTypes.node,
		actions: PropTypes.shape({
			requestUpdate: PropTypes.func.isRequired,
			selectedKeys: MobxPropTypes.observableArray.isRequired,
		}).isRequired,
		component: PropTypes.component,
	};

	static defaultProps = {
		label: '修改',
		multiLabel: '批量修改',
		type: 'primary',
		recordKeys: [],
		names: [],
		component: LinkButton,
	};

	static contextTypes = {
		issuer: PropTypes.string,
	};

	static LinkButton = LinkButton;

	_handleClick = (ev) => {
		ev.preventDefault();
		const { recordKeys, actions, names } = this.props;
		actions.requestUpdate(recordKeys, names);
	};

	render() {
		const {
			props: {
				actions: { selectedKeys },
				component, recordKeys, names, children, label, multiLabel, ...other,
			},
			context: { issuer },
		} = this;

		const selectedLength = recordKeys.length || selectedKeys.length;
		const isInToolbar = issuer === TOOLBAR;
		const Comp = isInToolbar ? Button : component;

		return (
			<Comp
				onClick={this._handleClick}
				{...other}
				disabled={!selectedLength}
			>
				{(selectedLength > 1 ? multiLabel : label) || children}
			</Comp>
		);
	}
}
