
import React, { Children } from 'react';
import PropTypes from 'utils/PropTypes';
import { returnsArgument } from 'empty-functions';
import parseAPIPath from 'utils/parseAPIPath';

export default function TableSchema() {
	return (<noscript />);
}

TableSchema.propTypes = {
	name: PropTypes.string.isRequired,
	apiPath: PropTypes.stringOrObject,
	mapOnFetchResponse: PropTypes.func,
	mapOnFetchOneResponse: PropTypes.func,
	mapOnSave: PropTypes.func,
};

TableSchema.defaultProps = {
	mapOnFetchResponse: returnsArgument,
	mapOnFetchOneResponse: returnsArgument,
	mapOnSave: returnsArgument,
};

TableSchema.setConfig = ({ name, apiPath, children, ...other }, tables) => {
	if (Children.count(children) === 1 && children.type === 'noscript') {
		children = children.props.children;
	}

	tables[name] = {
		...other,
		apiLoc: parseAPIPath(apiPath || name),
		data: children,
	};
};
TableSchema.schemaName = 'tables';
TableSchema.DataType = Object;
