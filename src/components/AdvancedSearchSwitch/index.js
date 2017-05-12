
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Checkbox } from 'antd';
import panelsStore from 'stores/panels';

@observer
export default class AdvancedSearchSwitch extends Component {
	_handleToggle = (ev) => {
		panelsStore.updateQuery(ev.target.checked);
	};

	render() {
		return (
			<Checkbox
				checked={panelsStore.isShowQuery}
				onChange={this._handleToggle}
			>
				高级搜索
			</Checkbox>
		);
	}
}
