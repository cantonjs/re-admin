
import { observable, computed, isObservable } from 'mobx';

class RouterLocation {
	@observable pathname = '/';
	@observable search = '?';
	@observable hash = '';

	@computed get query() {
		const searchParams = new URLSearchParams(location.search);
		return new Proxy({}, {
			get(target, key) {
				return searchParams.get(key);
			}
		});
	}

	constructor(loc) {
		Object.assign(this, loc);
	}
}

class Router {
	@observable location = { query: {} };
	@observable match = {};
	@observable params = {};
	@observable routes = [];
	@observable route = {};

	init({ location, match, history }) {
		this.location = new RouterLocation(location);
		this.match = match;
		this.history = history;
	}

	update(spec) {
		if (spec.location && !isObservable(spec.location)) {
			spec.location = new RouterLocation(spec.location);
		}
		Object.assign(this, spec);
	}
}

export default new Router();
