import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isObject } from 'lodash';
import warning from 'warning';
import field from 'hocs/field';
import withAppConfig from 'hocs/withAppConfig';
import RefSelector from 'components/RefSelector';

const isRefObjectValue = function isRefObjectValue(val) {
	return val && isObject(val);
};

let warned = false;

@withAppConfig((appConfig, props) => {
	const tableConfig = appConfig.tables[props.table];
	if (tableConfig) return { tableUniqueKey: tableConfig.uniqueKey };
})
@field
export default class RefField extends Component {
	static propTypes = {
		table: PropTypes.string.isRequired,
		tableUniqueKey: PropTypes.string.isRequired,
		displayField: PropTypes.string,
	};

	static renderTable(props, { value }) {
		let content = value;
		if (isRefObjectValue(value)) {
			const { displayField } = props;
			if (displayField) {
				content = value[displayField];
			} else {
				warning(
					warned,
					'It\'s recommeded to set a `displayField` in Ref component'
				);
				warned = true;
				try {
					content = JSON.stringify(value);
				} catch (err) {}
			}
		}
		return <span>{content}</span>;
	}

	_inputFilter = (val) => {
		if (isRefObjectValue(val)) {
			const { tableUniqueKey } = this.props;
			return val[tableUniqueKey];
		}
		return val;
	};

	render() {
		const { tableUniqueKey, ...other } = this.props;
		return <RefSelector inputFilter={this._inputFilter} {...other} />;
	}
}
