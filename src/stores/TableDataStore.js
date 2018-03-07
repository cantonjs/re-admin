import { autorun, observable, computed, toJS } from 'mobx';
import { isUndefined, omitBy } from 'lodash';
import modalStore from 'stores/modalStore';

export default class TableDataStore {
	@observable isFetching = false;
	@observable selectedKeys = [];
	@observable query = {};
	collections = observable.map();
	totals = observable.map();

	@computed
	get cacheKey() {
		return JSON.stringify(toJS(this.query));
	}

	@computed
	get collection() {
		return this.collections.get(this.cacheKey);
	}

	@computed
	get total() {
		return this.totals.get(this.cacheKey) || 0;
	}

	@computed
	get dataSource() {
		return toJS(this.collection);
	}

	@computed
	get sortedKey() {
		return this.query[this._appConfig.api.sortKey];
	}

	@computed
	get sortedOrder() {
		const { orderKey, ascValue } = this._appConfig.api;
		let order = this.query[orderKey];

		if (!this.sortedKey) {
			return order;
		}

		/* eslint-disable eqeqeq */
		return order == ascValue ? 'ascend' : 'descend';
	}

	@computed
	get columns() {
		if (!this.tableConfig.tableRenderers) {
			return [];
		}

		return this.tableConfig.tableRenderers.map(({ render, props, options }) => {
			const { getSchemaDefaultProps } = options;
			const column = {
				title: props.label || getSchemaDefaultProps().label,
				key: props.name,
				dataIndex: props.name,
				render: function renderTable(text, record, index) {
					return render(props, {
						...options,
						text,
						value: text,
						record,
						index,
					});
				},
			};

			if (props.sortable) {
				const { sortedKey, sortedOrder } = this;
				column.sortOrder = props.name === sortedKey ? sortedOrder : false;
				column.sorter = true;
			}

			return column;
		});
	}

	@computed
	get maxSelections() {
		return this.tableConfig.maxSelections;
	}

	@computed
	get queryRenderers() {
		return this.tableConfig.queryRenderers;
	}

	@computed
	get formRenderers() {
		return this.tableConfig.formRenderers;
	}

	constructor(service) {
		const { tableConfig, appConfig, baseRequest } = service;
		this.service = service;
		this.tableConfig = tableConfig;
		this._appConfig = appConfig;
		const { tableRenderers, queryRenderers, api } = this.tableConfig;

		this.size = +appConfig.api.count;
		this.extends = {};

		if (api) {
			const sortableField =
				tableRenderers && tableRenderers.find(({ props }) => props.sortable);

			this.uniqueKey = this.tableConfig.uniqueKey;
			this.hasSortableField = !!sortableField;
			this.hasQueryField = !!queryRenderers.length;
			const count = +api.query.count;
			const hasCount = !!count;

			if (hasCount) {
				this.size = count;
			}

			const request = baseRequest.clone({
				queryTransformer: (query) => {
					if (hasCount) {
						query.count = count;
					}
					return query;
				},
			});
			this.request = request.fetch.bind(request);
		}
	}

	addQueryListener(routerStore) {
		if (routerStore && routerStore.location) {
			this.query = routerStore.location.query;
			this._routerStore = routerStore;
		}
		this._hasBoundQueryListener = false;
		const disposer = autorun(() => {
			if (this.query && !this._hasBoundQueryListener) {
				this._hasBoundQueryListener = true;
			} else {
				this.callFetch({ query: this.query });
			}
		});
		return function removeQueryListener() {
			this._routerStore = null;
			return disposer();
		};
	}

	async setQuery(query) {
		if (this._routerStore) {
			this._routerStore.location.query = query;
		} else {
			this.query = query;
		}
	}

	async fetch(options = {}) {
		const { query = {}, method, url, body, headers } = options;
		const { cacheKey } = this;

		if (this.collections.has(cacheKey)) {
			return this;
		}

		this.isFetching = true;

		const fetchOptions = {
			method,
			url,
			body,
			headers,
			query: {
				count: this.size,
				...omitBy(query, modalStore.getOmitPaths),
				page: (function () {
					const p = query.page || 1;
					return p < 1 ? 1 : p;
				})(),
			},
		};
		const res = await this.request(omitBy(fetchOptions, isUndefined));
		const { total, list = [] } = await this.tableConfig.mapOnFetchResponse(res);

		const collection = list.map((data, index) => {
			data.key = this.uniqueKey ? data[this.uniqueKey] : index;
			return data;
		});

		this.collections.set(cacheKey, collection);
		this.totals.set(cacheKey, total);

		this.isFetching = false;
		return this;
	}

	refresh() {
		this.collections.clear();
		this.totals.clear();
		this.callFetch();
		this.selectedKeys = [];
	}

	setSelectedKeys(selectedKeys = []) {
		this.selectedKeys = selectedKeys;
	}

	clearSelectedKeys() {
		this.selectedKeys = [];
	}

	getData(key) {
		const { collection, uniqueKey, selectedKeys } = this;
		if (isUndefined(key)) {
			key = selectedKeys[0];
		}
		if (isUndefined(key) || !collection) {
			return null;
		}
		return collection.find(
			(dataItem, index) => key === (uniqueKey ? dataItem[uniqueKey] : index)
		);
	}

	async callFetch(options) {
		return this.service.request({
			requestFn: 'fetch',
			ref: this,
			...options,
		});
	}
}
