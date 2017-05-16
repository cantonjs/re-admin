
import './reset.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import getAppConfig from 'utils/getAppConfig';
import getRoutes from 'utils/getRoutes';
import authStore from 'stores/auth';
import DataStore from 'stores/Data';

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

export default class Admin extends Component {
	static childContextTypes = {
		appConfig: PropTypes.object,
		authStore: PropTypes.object,
		DataStore: PropTypes.func,
	};

	getChildContext() {
		return { appConfig, authStore, DataStore };
	}

	render() {
		return (
			<Router history={browserHistory}>
				<Route path="login" component={views.login} />
				<Route path="/" component={views.frame} onEnter={onEnter}>
					<IndexRoute component={views.index}/>
					{router}
					{getRoutes()}
					<Route path="*" component={views.notFound}/>
				</Route>
			</Router>
		);
	}
}
