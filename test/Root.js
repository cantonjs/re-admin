import React, { Component } from 'react';
import * as offlineRuntime from 'offline-plugin/runtime';
import App from './App';
import { Alert, Spin, Icon } from 'antd';

export default class Root extends Component {
	state = {
		isReady:
			navigator.serviceWorker &&
			navigator.serviceWorker.controller &&
			navigator.serviceWorker.controller.state === 'activated',
	};

	componentDidMount() {
		offlineRuntime.install({
			onInstalled: () => {
				this.setState({ isReady: true });
			},
			onUpdateReady: () => {
				offlineRuntime.applyUpdate();
			},
		});
	}

	render() {
		if (!navigator.serviceWorker) {
			return (
				<div style={{ padding: 10, height: '100%' }}>
					<Alert
						message="Error"
						description={
							<span>
								This demo requires{' '}
								<a href="https://w3c.github.io/ServiceWorker/">ServiceWorker</a>,
								please use the latest version Chrome or Firefox
							</span>
						}
						type="error"
						showIcon
					/>

					<a
						href="https://github.com/cantonjs/re-admin"
						style={{
							position: 'absolute',
							textAlign: 'center',
							display: 'block',
							width: '100%',
							bottom: 72,
						}}
					>
						<Icon type="github" style={{ color: '#999' }} /> Back to Github
					</a>
				</div>
			);
		}

		if (!this.state.isReady) {
			return (
				<div style={{ padding: 200, textAlign: 'center' }}>
					<Spin size="large" />
				</div>
			);
		}

		return <App />;
	}
}
