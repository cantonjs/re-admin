
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Checkbox } from 'antd';
import panelsStore from 'stores/panelsStore';

@observer
export default class ToolbarQuerySwitch extends Component {
	static propTypes = {
		children: PropTypes.node,
	};

	static defaultProps = {
		children: '高级搜索',
	};

	static contextTypes = {
		queryNodes: PropTypes.node.isRequired,
	};

	_handleToggle = (ev) => {
		panelsStore.updateQuery(ev.target.checked);
	};

	render() {
		if (!this.context.queryNodes.length) {
			return null;
		}

		const { children } = this.props;
		return (
			<Checkbox
				checked={panelsStore.isShowQuery}
				onChange={this._handleToggle}
			>
				{children}
			</Checkbox>
		);
	}
}
