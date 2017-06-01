
import { observable } from 'mobx';

class Router {
	@observable location = { query: {} };
	@observable params = {};
	@observable routes = [];
	@observable route = {};

	init({ router, location, params, routes, route }) {
		this.router = router;
		this.location = location;
		this.params = params;
		this.routes = routes;
		this.route = route;
	}

	update(spec) {
		Object.assign(this, spec);
	}
}

export default new Router();
