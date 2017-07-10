
import React, { Children } from 'react';
import PropTypes from 'utils/PropTypes';
import { returnsArgument } from 'empty-functions';

export default function TableSchema() {
	return (<noscript />);
}

TableSchema.propTypes = {
	name: PropTypes.string.isRequired,
	title: PropTypes.string,
	inputFilter: PropTypes.func,
	outputFilter: PropTypes.func,
	header: PropTypes.component,
	footer: PropTypes.component,
};

TableSchema.defaultProps = {
	inputFilter: returnsArgument,
	outputFilter: returnsArgument,
};

TableSchema.setConfig = ({ name, children, ...other }, tables) => {
	if (Children.count(children) === 1 && children.type === 'noscript') {
		children = children.props.children;
	}
	tables[name] = {
		...other,
		data: children,
	};
};
TableSchema.schemaName = 'tables';
TableSchema.DataType = Object;
