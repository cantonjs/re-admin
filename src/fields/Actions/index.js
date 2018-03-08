import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import field from 'hoc/field';
import ActionInternalView from './ActionInternalView';
import localize from 'hoc/localize';

@field
@localize({
	defaultProps: {
		label: 'label',
	},
})
export default class ActionsField extends Component {
	static propTypes = {
		component: PropTypes.component,
	};

	static defaultProps = {
		component: 'div',
		inTable: true,
	};

	static renderTable(props, { record }) {
		return <ActionInternalView {...props} tableRowKey={record.key} />;
	}

	render() {
		return <noscript />;
	}
}
