/* eslint-disable react/display-name */

import React, { Children } from 'react';
import PropTypes from 'utils/PropTypes';
import { returnsArgument } from 'empty-functions';
import parseAPIPath from 'utils/parseAPIPath';
import { isFunction, isObject, defaults } from 'lodash';
import FieldGateway from 'components/FieldGateway';

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
			const component = Component;
			const options = {
				key,
				component,
				Component,
			};

			const makeRender = (renderProp) => (store = {}, otherProps) => {
				const ensuredStore = (function () {
					defaults(store, options);
					if (!('record' in store)) store.record = {};
					if (!('name' in store)) store.name = name;
					if (!('value' in store)) store.value = store.record[store.name];
					if (!('index' in store)) store.index = 0;
					return store;
				})();

				if (isFunction(otherProps)) {
					const children = otherProps;
					otherProps = { children };
				}

				const createRenderFn = (inIssuer) => (extraProps) => {
					const instanceProps = { ...props, ...extraProps };

					if (isFunction(inIssuer)) {
						return inIssuer(instanceProps, ensuredStore);
					}

					if (isObject(inIssuer)) {
						return <Component {...instanceProps} {...inIssuer} />;
					}

					if (isFunction(Component[renderProp])) {
						return Component[renderProp](instanceProps, ensuredStore);
					}

					if (renderProp === 'renderTable') return ensuredStore.value;
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
						options={ensuredStore}
						props={props}
						renderer={renderer}
						{...otherProps}
					/>
				);
			};
			renderers.push({
				options,
				props,
				renderTable: makeRender('renderTable'),
				renderQuery: makeRender('renderQuery'),
				renderForm: makeRender('renderForm'),
			});
		});

		const table = {
			...other,
			api: parseAPIPath(api || name),
			queryRenderers,
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
