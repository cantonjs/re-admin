import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import panelsStore from 'stores/panelsStore';
import withStore from 'hocs/withStore';
import localize from 'hocs/localize';
import { Checkbox } from 'antd';

@withStore()
@localize('TableQuerySwitch')
@observer
export default class TableQuerySwitch extends Component {
	static propTypes = {
		children: PropTypes.node,
		store: PropTypes.object.isRequired,
		localeStore: PropTypes.object.isRequired,
	};

	_handleToggle = (ev) => {
		panelsStore.updateQuery(ev.target.checked);
	};

	render() {
		const { store: { queryFieldsCount }, children, localeStore } = this.props;
		if (!queryFieldsCount) return null;
		return (
			<Checkbox checked={panelsStore.isShowQuery} onChange={this._handleToggle}>
				{localeStore.localizeProp(children, 'label')}
			</Checkbox>
		);
	}
}
