import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import panelsStore from 'stores/panelsStore';
import localize from 'hocs/localize';
import { Checkbox } from 'antd';

@localize({
	defaultProps: {
		children: 'label',
	},
})
@observer
export default class TableQuerySwitch extends Component {
	static propTypes = {
		children: PropTypes.node,
	};

	static contextTypes = {
		store: PropTypes.object.isRequired,
	};

	_handleToggle = (ev) => {
		panelsStore.updateQuery(ev.target.checked);
	};

	render() {
		const { queryFieldsCount } = this.context.store;
		if (!queryFieldsCount) return null;
		const { children } = this.props;
		return (
			<Checkbox checked={panelsStore.isShowQuery} onChange={this._handleToggle}>
				{children}
			</Checkbox>
		);
	}
}
