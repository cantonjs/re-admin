import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import routerStore from 'stores/routerStore';
import authStore from 'stores/authStore';
import DataStore from 'stores/DataStore';
import { Router } from 'react-router-mobx';
import DocumentTitle from 'react-document-title';
import { initModals } from './initialize';

const styles = {
	container: {
		height: '100%',
	},
};

@observer
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
		return {
			appConfig: this._appConfig,
			authStore,
			DataStore,
		};
	}

	componentWillMount() {
		this._appConfig = observable(this.props.appConfig);
		authStore.set(this._appConfig);
		DataStore.setup(this._appConfig, authStore);
		initModals(this._appConfig.modals);
	}

	componentWillReceiveProps({ appConfig }) {
		// this._appConfig = appConfig;
		Object.assign(this._appConfig, appConfig);
		authStore.set(this._appConfig);
		// DataStore.hotUpdate(appConfig);
	}

	render() {
		const {
			title,
			navigator: { frame: Frame, login: Login, routes },
		} = this.props.appConfig;

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
			<DocumentTitle title={title}>
				<Router component={BrowserRouter} routerStore={routerStore}>
					<div style={styles.container}>
						<Switch>
							<Route path="/login" component={Login} />
							<Route
								onEnter={handleEnter}
								render={({ location }) => (
									<Frame locKey={location.key}>{routes}</Frame>
								)}
							/>
						</Switch>
					</div>
				</Router>
			</DocumentTitle>
		);
	}
}
