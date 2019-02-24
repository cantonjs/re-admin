/* eslint-disable react/display-name */

import React, { Children } from 'react';
import PropTypes from 'utils/PropTypes';
import { returnsArgument } from 'empty-functions';
import parseAPIPath from 'utils/parseAPIPath';
import { isFunction, isObject } from 'utils/fp';
import FieldGateway from 'components/FieldGateway';
import createRendererState from './createRendererState';

export default function TableSchema() {
	return <noscript />;
}

TableSchema.propTypes = {
	name: PropTypes.string.isRequired,
	api: PropTypes.stringOrObject,
	mapOnFetchRequest: PropTypes.func,
	mapOnFetchOneRequest: PropTypes.func,
	mapOnFetchResponse: PropTypes.func,
	mapOnFetchOneResponse: PropTypes.func,
	mapOnSave: PropTypes.func,
	uniqueKey: PropTypes.string,
	maxSelections: PropTypes.number,
	extend: PropTypes.object,
	viewSize: PropTypes.string,
	useCursor: PropTypes.bool,
};

TableSchema.defaultProps = {
	mapOnFetchRequest: returnsArgument,
	mapOnFetchOneRequest: returnsArgument,
	mapOnFetchResponse: returnsArgument,
	mapOnFetchOneResponse: returnsArgument,
	mapOnSave: returnsArgument,
	uniqueKey: '_id',
	maxSelections: -1,
	extend: {},
	viewSize: 'middle',
	useCursor: false,
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
			const { name } = props;

			if (!uniqueKey && unique) uniqueKey = name;

			const key = child.key || index;
			const Component = child.type;
			const options = { key, Component, name };

			const makeRender = (renderProp) => (store, otherProps) => {
				const state = createRendererState(store, options);

				if (isFunction(otherProps)) {
					const children = otherProps;
					otherProps = { children };
				}

				const createRenderFn = (inIssuer) => (extraProps) => {
					const instanceProps = { ...props, ...extraProps };

					if (isFunction(inIssuer)) {
						return inIssuer(instanceProps, state);
					}

					if (isObject(inIssuer)) {
						return <Component {...instanceProps} {...inIssuer} />;
					}

					if (isFunction(Component[renderProp])) {
						return Component[renderProp](instanceProps, state);
					}

					if (renderProp === 'renderTable') return state.value;
					return <Component {...instanceProps} />;
				};

				const renderer = (ctx) => {
					if (inTable) ctx.when(ctx.is.TABLE, createRenderFn(inTable));
					if (inForm) {
						ctx.when(ctx.is.UPDATER || ctx.is.CREATER, createRenderFn(inForm));
					}
					if (inQuery) ctx.when(ctx.is.QUERIER, createRenderFn(inQuery));
					if (rendererProp) rendererProp(ctx);
				};

				return (
					<FieldGateway
						state={state}
						props={props}
						renderer={renderer}
						{...otherProps}
					/>
				);
			};
			renderers.push({
				props,
				renderTable: makeRender('renderTable'),
				renderQuery: makeRender('renderQuery'),
				renderForm: makeRender('renderForm'),
			});
		});

		const table = {
			...other,
			api: parseAPIPath(api || name),
			renderers,
		};

		if (uniqueKey) table.uniqueKey = uniqueKey;

		this[name] = table;

		if (renderers.length && !table.uniqueKey) {
			console.error(`Table "${name}" is missing uniqueKey!`);
		}

		return this;
	},
	initialData: {},
};
