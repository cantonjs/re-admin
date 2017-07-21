
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import getRoutes from 'utils/getRoutes';
import authStore from 'stores/authStore';
import DataStore from 'stores/DataStore';
import RouterContext from 'components/RouterContext';

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
			authStore,
			DataStore,
		};
	}

	componentWillMount() {
		const { appConfig } = this.props;
		authStore.init(appConfig);
		DataStore.setup(appConfig, authStore);
	}

	render() {
		const {
			appConfig,
			appConfig: {
				navigator: {
					frame: Frame,
					login: Login,
					index: Index,
					notFound: NotFound,
					routes,
				},
			},
		} = this.props;

		const handleEnter = async (nextState, replace, next) => {
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

		return (
			<Router>
				<RouterContext>
					<Switch>
						<Route path="/login" component={Login} />
						<Route onEnter={handleEnter}>
							{({ match }) =>
								<Frame>
									<Route exact path="/" component={Index} />
									{routes}
									{getRoutes(appConfig, match)}
									<Route component={NotFound} />
								</Frame>
							}
						</Route>
					</Switch>
				</RouterContext>
			</Router>
		);
	}
}
