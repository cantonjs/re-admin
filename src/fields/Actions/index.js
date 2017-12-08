
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import withField from 'utils/withField';
import ActionInternalView from './ActionInternalView';

@withField
export default class Actions extends Component {
	static propTypes = {
		component: PropTypes.component,
	};

	static defaultProps = {
		label: '自定义操作',
		component: 'div',
		inTable: true,
	};

	static renderTable(props, { record }) {
		return (
			<ActionInternalView {...props} tableRowKey={record.key} />
		);
	}

	render() {
		return (<noscript />);
	}
}
