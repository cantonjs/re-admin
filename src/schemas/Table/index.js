import React, { Children, cloneElement } from 'react';
import PropTypes from 'utils/PropTypes';
import { returnsArgument } from 'empty-functions';
import parseAPIPath from 'utils/parseAPIPath';
import { isFunction, isObject, isBoolean } from 'lodash';

const returnsEmptyObject = () => ({});

export default function TableSchema() {
	return <noscript />;
}

TableSchema.propTypes = {
	name: PropTypes.string.isRequired,
	api: PropTypes.stringOrObject,
	mapOnFetchResponse: PropTypes.func,
	mapOnFetchOneResponse: PropTypes.func,
	mapOnSave: PropTypes.func,
	uniqueKey: PropTypes.string,
	maxSelections: PropTypes.number,
	extend: PropTypes.object,
};

TableSchema.defaultProps = {
	mapOnFetchResponse: returnsArgument,
	mapOnFetchOneResponse: returnsArgument,
	mapOnSave: returnsArgument,
	maxSelections: -1,
	extend: {},
};

TableSchema.setConfig = ({ name, api, children, ...other }, tables) => {
	children = Children.toArray(children);
	const firstChild = children[0];
	if (firstChild && children.length === 1 && firstChild.type === 'noscript') {
		children = Children.toArray(firstChild.props.children);
	}

	let uniqueKey;

	const formRenderers = [];
	const queryRenderers = [];
	const tableRenderers = [];

	children.forEach((child, index) => {
		const { inForm, inQuery, inTable, unique, ...props } = child.props;
		const { getSchemaDefaultProps = returnsEmptyObject } = child.type;

		const push = (nodes, inIssuer, renderKey, defaultRender) => {
			if (!inIssuer) {
				return;
			}

			const key = child.key || index;
			const Component = child.type;
			const component = Component;

			const render = (function () {
				if (isFunction(inIssuer)) {
					return inIssuer;
				}

				if (isObject(inIssuer)) {
					return function render(props) {
						return <Component {...props} {...inIssuer} />;
					};
				}

				if (!isBoolean(inIssuer)) {
					return function render() {
						return <span>{inIssuer}</span>;
					};
				}

				if (isFunction(Component[renderKey])) {
					return Component[renderKey];
				}

				if (defaultRender) {
					return defaultRender;
				}

				return function render(props) {
					return <Component {...props} />;
				};
			})();

			const options = {
				key,
				component,
				Component,
				getSchemaDefaultProps,
			};

			const renderNode = () => {
				const node = render(props, options);
				if (!node) {
					return null;
				}
				return node.key ? node : cloneElement(node, { key });
			};

			nodes.push({ render, renderNode, props, options });
		};

		if (!uniqueKey && unique) {
			uniqueKey = props.name;
		}
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
