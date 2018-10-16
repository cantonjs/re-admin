import { action, observable, computed, runInAction } from 'mobx';
import { isUndefined, omitBy } from 'lodash';
import BaseDataStore from 'stores/BaseDataStore';
import parseColumn from 'utils/parseColumn';

export default class DataListStore extends BaseDataStore {
	@observable isFetching = false;
	@observable selectedKeys = [];
	@observable queryFieldsCount = 0;

	@observable cursors = [null];
	@observable cursorIndex = 0;

	collections = observable.map();
	totals = observable.map();

	@computed
	get collection() {
		const { cacheKey } = this;
		return this.collections.get(cacheKey);
	}

	@computed
	get total() {
		return this.totals.get(this.cacheKey);
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
		const { renderers } = this.config;
		if (!renderers) return [];
		return renderers.map(({ renderTable: renderCell, props }) => {
			const column = parseColumn({
				title: props.label,
				key: props.name,
				dataIndex: props.name,
				headers: { renderCell },
				body: (state) => ({
					store: { text: state.value, ...state },
					renderCell,
				}),
			});
			if (props.sortable) {
				const { sortedKey, sortedOrder } = this;
				column.sortOrder = props.name === sortedKey ? sortedOrder : false;
				column.sorter = true;
			}
			return column;
		});
	}

	@computed
	get prevCursor() {
		const prevIndex = this.cursorIndex - 1;
		return prevIndex < 0 ? undefined : this.cursors[prevIndex];
	}

	@computed
	get nextCursor() {
		const { cursors, cursorIndex } = this;
		const nextIndex = cursorIndex + 1;
		return nextIndex >= cursors.length ? undefined : cursors[nextIndex];
	}

	get maxSelections() {
		return this.config.maxSelections;
	}

	get renderers() {
		return this.config.renderers;
	}

	constructor(options) {
		super(options);

		const { config, appConfig, baseRequest } = this;
		const { api } = config;

		this.size = +appConfig.api.count;

		if (api) {
			this.uniqueKey = config.uniqueKey;
			this.useCursor = config.useCursor;

			const count = +api.query.count;
			const hasCount = !!count;

			if (hasCount) {
				this.size = count;
			}

			const request = baseRequest.clone({
				queryTransformer: (query) => {
					if (hasCount) query.count = count;
					return query;
				},
			});
			this.performRequest = request.fetch.bind(request);
		}
	}

	@action
	async fetch(options = {}) {
		const { query: queryOptions, method, url, body, headers } = options;
		const { cacheKey, useCursor } = this;

		if (
			this.collections.has(cacheKey) &&
			this.collections.get(cacheKey).length
		) {
			return this;
		}

		this.isFetching = true;
		const query = { count: this.size, ...queryOptions };
		if (useCursor) {
			if (query.cursor === null) delete query.cursor;
		} else {
			const page = (queryOptions && queryOptions.page) || 1;
			query.page = page < 1 ? 1 : page;
		}

		const fetchOptions = {
			method,
			url,
			body,
			headers,
			query,
		};

		const res = await this.request({
			...omitBy(fetchOptions, isUndefined),
			refresh: false,
		});

		const requestRes = await this.config.mapOnFetchResponse(res);
		const { total, list = [], nextCursor } = requestRes || {};

		const collection = list.map((data, index) => {
			data.key = this.uniqueKey ? data[this.uniqueKey] : index;
			return data;
		});

		this.collections.set(cacheKey, collection);
		if (!isUndefined(total)) this.totals.set(cacheKey, total);

		runInAction(() => {
			if (useCursor) this.cursors.push(nextCursor);
			this.isFetching = false;
		});
		return this;
	}

	@action
	refresh() {
		this.collections.clear();
		this.totals.clear();
		this.resetCursors();
		this.fetch({ query: this.query });
		this.selectedKeys = [];
	}

	@action
	decreaseCursorIndex() {
		return --this.cursorIndex;
	}

	@action
	increaseCursorIndex() {
		return ++this.cursorIndex;
	}

	@action
	increaseQueryFieldsCount() {
		this.queryFieldsCount++;
	}

	@action
	resetCursors() {
		this.cursors = [null];
		this.cursorIndex = 0;
	}

	@action
	decreaseQueryFieldsCount() {
		this.queryFieldsCount--;
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
