import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import field from 'hoc/field';
import ActionInternalView from './ActionInternalView';
import ActionLabel from './ActionLabel';

@field
export default class ActionsField extends Component {
	static propTypes = {
		component: PropTypes.component,
	};

	static defaultProps = {
		component: 'div',
		inTable: true,
		label: () => <ActionLabel />,
	};

	static renderTable(props, { record }) {
		return <ActionInternalView {...props} tableRowKey={record.key} />;
	}

	render() {
		return <noscript />;
	}
}
