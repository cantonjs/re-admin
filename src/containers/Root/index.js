
import './reset.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from 'containers/App';
import IndexView from 'containers/IndexView';
import Login from 'containers/Login';
import NotFound from 'containers/NotFound';
import getAppConfig from 'utils/getAppConfig';
import getRoutes from 'utils/getRoutes';
import authStore from 'stores/auth';

const appConfig = getAppConfig();
const { router, views } = appConfig;

const onEnter = async (nextState, replace, next) => {
	const { pathname, search } = nextState.location;
	const isOk = await authStore.auth();
	if (!isOk) {
		replace({
			pathname: '/login',
			query: {
				ref: pathname + search,
			},
		});
	}
	next();
};

export default class Root extends Component {
	static childContextTypes = {
		appConfig: PropTypes.object,
	};

	getChildContext() {
		return { appConfig };
	}

	render() {
		return (
			<Router history={browserHistory}>
				<Route path="login" component={views.login || Login} />
				<Route path="/" component={App} onEnter={onEnter}>
					<IndexRoute component={views.index || IndexView}/>
					{router}
					{getRoutes()}
					<Route path="*" component={views.notFound || NotFound}/>
				</Route>
			</Router>
		);
	}
}
