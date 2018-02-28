import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import withField from 'utils/withField';
import ActionInternalView from './ActionInternalView';
import locale from 'hoc/locale';

@withField
@locale({
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
