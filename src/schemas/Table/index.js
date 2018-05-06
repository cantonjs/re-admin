import React, { Children, cloneElement } from 'react';
import PropTypes from 'utils/PropTypes';
import { returnsArgument } from 'empty-functions';
import parseAPIPath from 'utils/parseAPIPath';
import { isFunction, isObject, isBoolean } from 'lodash';
import FieldGateway from 'components/FieldGateway';

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
	uniqueKey: '_id',
	maxSelections: -1,
	extend: {},
};

TableSchema.configuration = {
	name: 'tables',
	propType: PropTypes.object,
	pipe({ name, api, children, ...other }) {
		children = Children.toArray(children);
		const firstChild = children[0];
		if (firstChild && children.length === 1 && firstChild.type === 'noscript') {
			children = Children.toArray(firstChild.props.children);
		}

		let uniqueKey;

		const queryRenderers = [];
		const tableRenderers = [];
		const renderers = [];

		children.forEach((child, index) => {
			const {
				inForm,
				inQuery,
				inTable,
				unique,
				renderer: rendererProp,
				...props
			} = child.props;
			const { getSchemaDefaultProps = returnsEmptyObject } = child.type;

			/* TO BE DELETED STARTS */
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
			push(queryRenderers, inQuery, 'renderQuery');
			push(tableRenderers, inTable, 'renderTable', (props, { text }) => text);
			/* TO BE DELETED END */

			const key = child.key || index;
			const Component = child.type;
			const component = Component;
			const options = {
				key,
				component,
				Component,
				getSchemaDefaultProps,
			};
			renderers.push({
				render(renderKey, extraOptions, extraGatewayProps) {
					// eslint-disable-next-line react/display-name
					const createRenderFn = (inIssuer) => (otherProps) => {
						const instanceProps = { ...props, ...otherProps };
						const getRenderOptions = () => ({ ...options, ...extraOptions });

						if (isFunction(inIssuer)) {
							return inIssuer(instanceProps, getRenderOptions());
						}

						if (isObject(inIssuer)) {
							return <Component {...instanceProps} {...inIssuer} />;
						}

						if (isFunction(Component[renderKey])) {
							return Component[renderKey](instanceProps, getRenderOptions());
						}

						if (renderKey === 'renderTable') return extraOptions.value;
						return <Component {...instanceProps} />;
					};

					const renderer = (ctx) => {
						if (inTable) ctx.when(ctx.is.TABLE, createRenderFn(inTable));
						if (inForm) {
							ctx.when(
								ctx.is.UPDATER || ctx.is.CREATER,
								createRenderFn(inForm)
							);
						}
						if (inQuery) {
							ctx.when(ctx.is.QUERIER, createRenderFn(inQuery));
						}
						if (rendererProp) rendererProp(ctx);
					};

					return (
						<FieldGateway
							options={options}
							props={props}
							renderer={renderer}
							{...extraGatewayProps}
						/>
					);
				},
				props,
				options,
			});
		});

		const table = {
			...other,
			api: parseAPIPath(api || name),
			queryRenderers,
			tableRenderers,
			renderers,
		};

		if (uniqueKey) table.uniqueKey = uniqueKey;

		this[name] = table;

		if (tableRenderers.length && !table.uniqueKey) {
			console.error(`Table "${name}" is missing uniqueKey!`);
		}

		return this;
	},
	initialData: {},
};
