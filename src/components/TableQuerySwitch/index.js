import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import panelsStore from 'stores/panelsStore';
import locale from 'hoc/locale';
import { Checkbox } from 'antd';

@locale({
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
		const { hasSortableField, hasQueryField } = this.context.store;

		if (!hasSortableField && !hasQueryField) {
			return null;
		}

		const { children } = this.props;
		return (
			<Checkbox checked={panelsStore.isShowQuery} onChange={this._handleToggle}>
				{children}
			</Checkbox>
		);
	}
}