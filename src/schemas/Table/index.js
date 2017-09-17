
import React, { Children, cloneElement } from 'react';
import PropTypes from 'utils/PropTypes';
import { returnsArgument } from 'empty-functions';
import parseAPIPath from 'utils/parseAPIPath';
import { isFunction, isObject, isBoolean } from 'lodash';

export default function TableSchema() {
	return (<noscript />);
}

TableSchema.propTypes = {
	name: PropTypes.string.isRequired,
	api: PropTypes.stringOrObject,
	mapOnFetchResponse: PropTypes.func,
	mapOnFetchOneResponse: PropTypes.func,
	mapOnSave: PropTypes.func,
	uniqueKey: PropTypes.string,
	maxSelections: PropTypes.number,
};

TableSchema.defaultProps = {
	mapOnFetchResponse: returnsArgument,
	mapOnFetchOneResponse: returnsArgument,
	mapOnSave: returnsArgument,
	maxSelections: -1,
};

TableSchema.setConfig = ({ name, api, children, ...other }, tables) => {
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

					if (isObject(issuer)) {
						return function render(props) {
							return (<Component {...props} {...issuer} />);
						};
					}

					if (!isBoolean(issuer)) {
						return function render() {
							return (<span>{issuer}</span>);
						};
					}

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

	let uniqueKey;

	children.forEach((child, index) => {
		const { inForm, inQuery, inTable, unique, ...props } = child.props;
		const push = createPusher(child, props, index);
		if (!uniqueKey && unique) { uniqueKey = props.name; }
		push(formRenderers, inForm, 'renderForm');
		push(queryRenderers, inQuery, 'renderQuery');
		push(tableRenderers, inTable, 'renderTable', (props, { text }) => text);
	});

	const table = {
		uniqueKey,
		...other,
		api: parseAPIPath(api || name),
		formRenderers,
		queryRenderers,
		tableRenderers,
	};

	tables[name] = table;

	if (tableRenderers.length && !table.uniqueKey) {
		console.error(`Table "${name}" is missing uniqueKey!`);
	}
};
TableSchema.schemaName = 'tables';
TableSchema.DataType = Object;
