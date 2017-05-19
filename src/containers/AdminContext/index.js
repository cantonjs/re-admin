
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import getRoutes from 'utils/getRoutes';
import AuthStore from 'stores/AuthStore';
import DataStore from 'stores/DataStore';

export default class AdminContext extends Component {
	static propTypes = {
		appConfig: PropTypes.object,
	};

	static childContextTypes = {
		appConfig: PropTypes.object,
		authStore: PropTypes.object,
		DataStore: PropTypes.func,
	};

	getChildContext() {
		const { appConfig } = this.props;
		return {
			appConfig,
			authStore: this._authStore,
			DataStore,
		};
	}

	componentWillMount() {
		const { appConfig } = this.props;
		this._authStore = new AuthStore(appConfig);
		DataStore.setup(appConfig, this._authStore);
	}

	render() {
		const {
			appConfig,
			appConfig: { navigator },
		} = this.props;

		const handleEnter = async (nextState, replace, next) => {
			const { pathname, search } = nextState.location;
			const isOk = await this._authStore.auth();
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

		return (
			<Router history={browserHistory}>
				<Route path="login" component={navigator.login} />
				<Route path="/" component={navigator.frame} onEnter={handleEnter}>
					<IndexRoute component={navigator.index}/>
					{appConfig.navigator.routes}
					{getRoutes(appConfig)}
					<Route path="*" component={navigator.notFound}/>
				</Route>
			</Router>
		);
	}
}
