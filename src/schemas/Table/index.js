
import React, { Children } from 'react';
import PropTypes from 'prop-types';

export default function TableSchema() {
	return (<noscript />);
}

TableSchema.propTypes = {
	name: PropTypes.string.isRequired,
	title: PropTypes.string,
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
