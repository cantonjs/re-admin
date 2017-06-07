
import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { returnsArgument } from 'empty-functions';

export default function TableSchema() {
	return (<noscript />);
}

TableSchema.propTypes = {
	name: PropTypes.string.isRequired,
	title: PropTypes.string,
	inputFilter: PropTypes.func,
	outputFilter: PropTypes.func,
};

TableSchema.defaultProps = {
	inputFilter: returnsArgument,
	outputFilter: returnsArgument,
};

TableSchema.setConfig = ({ name, title, children }, tables) => {
	if (Children.count(children) === 1 && children.type === 'noscript') {
		children = children.props.children;
	}
	tables[name] = {
		title: title,
		data: children,
	};
};
TableSchema.schemaName = 'tables';
TableSchema.DataType = Object;
