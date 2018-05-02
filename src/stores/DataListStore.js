import { autorun, action, observable, computed, toJS } from 'mobx';
import { isUndefined, omitBy } from 'lodash';
import modalStore from 'stores/modalStore';
import BaseDataStore from 'stores/BaseDataStore';

export default class DataListStore extends BaseDataStore {
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
		return this.query[this.appConfig.api.sortKey];
	}

	@computed
	get sortedOrder() {
		const { orderKey, ascValue } = this.appConfig.api;
		let order = this.query[orderKey];

		if (!this.sortedKey) {
			return order;
		}

		/* eslint-disable eqeqeq */
		return order == ascValue ? 'ascend' : 'descend';
	}

	@computed
	get columns() {
		if (!this.config.tableRenderers) {
			return [];
		}

		return this.config.tableRenderers.map(({ render, props, options }) => {
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

	get maxSelections() {
		return this.config.maxSelections;
	}

	get queryRenderers() {
		return this.config.queryRenderers;
	}

	get formRenderers() {
		return this.config.formRenderers;
	}

	constructor(options) {
		super(options);

		const { config, appConfig, baseRequest } = this;
		const { tableRenderers, queryRenderers, api } = config;

		this.size = +appConfig.api.count;
		this.extends = {};

		if (api) {
			const sortableField =
				tableRenderers && tableRenderers.find(({ props }) => props.sortable);

			this.uniqueKey = config.uniqueKey;
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
			this.performRequest = request.fetch.bind(request);
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
				// fetch trick
				setTimeout(() => {
					this.fetch({ query: this.query });
				});
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
		const { query, method, url, body, headers } = options;
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
					const p = (query && query.page) || 1;
					return p < 1 ? 1 : p;
				})(),
			},
		};

		const res = await this.request({
			...omitBy(fetchOptions, isUndefined),
			refresh: false,
		});

		const requestRes = await this.config.mapOnFetchResponse(res);
		const { total, list = [] } = requestRes || {};

		const collection = list.map((data, index) => {
			data.key = this.uniqueKey ? data[this.uniqueKey] : index;
			return data;
		});

		this.collections.set(cacheKey, collection);
		this.totals.set(cacheKey, total);
		this.isFetching = false;
		return this;
	}

	@action
	refresh() {
		this.collections.clear();
		this.totals.clear();
		this.fetch({ query: this.query });
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
}
