
import React, { Children, cloneElement } from 'react';
import PropTypes from 'utils/PropTypes';
import { returnsArgument } from 'empty-functions';
import parseAPIPath from 'utils/parseAPIPath';
import { isFunction } from 'lodash';

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

	const formRenderers = [];
	const queryRenderers = [];
	const tableRenderers = [];

	const createPusher = (child, props, index) => {
		return (nodes, issuer, renderKey, defaultRender) => {
			if (issuer) {
				const key = child.key || index;
				const Component = child.type;
				const component = Component;

				const render = (function () {
					if (isFunction(issuer)) { return issuer; }
					if (isFunction(Component[renderKey])) { return Component[renderKey]; }
					if (defaultRender) { return defaultRender; }
					return function render(props) { return (<Component {...props} />); };
				}());

				const options = {
					key,
					component,
					Component,
				};

				const renderNode = () => {
					const node = render(props, options);
					return node.key ? node : cloneElement(node, { key });
				};

				nodes.push({ render, renderNode, props, options });
			}
		};
	};

	children.forEach((child, index) => {
		const { inForm, inQuery, inTable, ...props } = child.props;
		const push = createPusher(child, props, index);
		push(formRenderers, inForm, 'renderForm');
		push(queryRenderers, inQuery, 'renderQuery');
		push(tableRenderers, inTable, 'renderTable', (props, { text }) => text);
	});

	tables[name] = {
		...other,
		apiLoc: parseAPIPath(apiPath || name),
		formRenderers,
		queryRenderers,
		tableRenderers,
	};
};
TableSchema.schemaName = 'tables';
TableSchema.DataType = Object;
