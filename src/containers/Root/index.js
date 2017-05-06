
import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from 'containers/App';
import Home from 'containers/Home';
import NotFound from 'containers/NotFound';

export default class Root extends Component {
	render() {
		return (
			<Router history={browserHistory}>
				<Route path="/" component={App}>
					<IndexRoute component={Home}/>
					<Route path="*" component={NotFound}/>
				</Route>
			</Router>
		);
	}
}
