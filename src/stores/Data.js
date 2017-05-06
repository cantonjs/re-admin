
import { observable, computed, toJS } from 'mobx';

// TODO
import fakeFetch from 'utils/fakeFetch';

export default class Store {
	@observable collection = [];
	@observable total = 0;
	@observable isFetching = false;
	@observable pageIndex = 0;

	@computed get dataSource() {
		return toJS(this.collection);
	}

	size = 20;

	constructor(schema) {
		this._schema = schema;
		this.columns = schema.map(({ title, key, render }) => ({
			title,
			key,
			render,
			dataIndex: key,
		}));
	}

	async fetch() {
		this.isFetching = true;
		const { total, list } = await fakeFetch({
			count: this.size,
		});
		this.isFetching = false;
		this.total = total;
		this.collection = list.map((data, index) => {

			// TODO: should depend on `schema.unique`
			data.key = data.key || index;

			return data;
		});
		return this;
	}

	setPageIndex(index) {
		this.pageIndex = index;
	}
}
