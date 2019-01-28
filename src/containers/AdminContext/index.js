import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import routerStore from 'stores/routerStore';
import authStore from 'stores/authStore';
import AppConfigContext from 'contexts/AppConfig';
import { Router } from 'react-router-mobx';
import DocumentTitle from 'react-document-title';

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
	};

	getChildContext() {
		return {
			appConfig: this._appConfig,
			authStore,
		};
	}

	constructor(props) {
		super(props);
		this._appConfig = observable(props.appConfig);
		authStore.set(this._appConfig);
	}

	componentDidUpdate({ appConfig }) {
		Object.assign(this._appConfig, appConfig);
		authStore.set(this._appConfig);
	}

	render() {
		const {
			title,
			footer,
			navigator: {
				frame: Frame,
				login: Login,
				setPassword: SetPassword,
				basename,
				...otherNaviProps
			},
		} = this.props.appConfig;
		return (
			<AppConfigContext.Provider value={this._appConfig}>
				<DocumentTitle title={title}>
					<Router
						component={BrowserRouter}
						basename={basename}
						routerStore={routerStore}
					>
						<div style={styles.container}>
							<Switch>
								<Route path="/login" component={Login} />
								<Route path="/password" component={SetPassword} />
								<Route
									render={({ location }) => (
										<Frame
											locKey={location.key}
											footer={footer}
											{...otherNaviProps}
										/>
									)}
								/>
							</Switch>
						</div>
					</Router>
				</DocumentTitle>
			</AppConfigContext.Provider>
		);
	}
}
