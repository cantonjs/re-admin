
import { observable, computed } from 'mobx';
import { parse, stringify } from 'utils/qs';

const $router = Symbol('router');

const stripQuery = (loc) => {
	if (loc.query) {
		loc.search = stringify(loc.query);
		delete loc.query;
	}
	return loc;
};

class RouterLocation {
	@observable pathname = '/';
	@observable search = '?';
	@observable hash = '';

	@computed get query() {
		return parse(this.search);
	}

	set query(query) {
		this[$router].push({
			pathname: this.pathname,
			query,
		});
	}

	constructor(loc, router) {
		this[$router] = router;
		this.update(loc);
	}

	update(loc) {
		Object.assign(this, loc);
	}
}

class RouterStore {
	@observable location = { query: {} };
	@observable match = {};

	init({ location, match, history }) {
		this.match = match;
		this.history = history;
		this.location = new RouterLocation(location, this);

		history.listen((loc) => {
			this.location.update(loc);
		});
	}

	__setMatch(match) {
		this.match = match;
	}

	push(loc, state) {
		return this.history.push(stripQuery(loc), state);
	}

	replace(loc, state) {
		return this.history.replace(stripQuery(loc), state);
	}
}

export default new RouterStore();
