
import React, { Children } from 'react';
import PropTypes from 'utils/PropTypes';
import { returnsArgument } from 'empty-functions';
import parseAPIPath from 'utils/parseAPIPath';
import { isObject } from 'lodash';

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
	children = Children.toArray(children);
	const firstChild = children[0];
	if (firstChild && children.length === 1 && firstChild.type === 'noscript') {
		children = Children.toArray(firstChild.props.children);
	}

	const formList = [];
	const queryList = [];
	const tableList = [];

	function createPusher(child, props, index) {
		const push = (nodes, issuer, preferComponent) => {
			if (issuer) {
				const options = isObject(issuer) ? issuer : {};
				const { component, ...other } = options;
				nodes.push({
					Component: component || child.type[preferComponent] || child.type,
					props: { ...props, ...other },
					key: child.key || index,
				});
			}
		};
		return push;
	}

	children.forEach((child, index) => {
		const { inForm, inQuery, inTable, ...props } = child.props;
		const push = createPusher(child, props, index);
		push(formList, inForm, 'Form');
		push(queryList, inQuery, 'Query');
		push(tableList, inTable, 'Table');
	});

	tables[name] = {
		...other,
		apiLoc: parseAPIPath(apiPath || name),
		data: children,
		formList,
		queryList,
		tableList,
	};
};
TableSchema.schemaName = 'tables';
TableSchema.DataType = Object;
