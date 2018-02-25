import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './App';
import * as offlineRuntime from 'offline-plugin/runtime';

const ready = function ready() {
	const mount = document.getElementById('mount');

	render(
		<AppContainer>
			<App />
		</AppContainer>,
		mount
	);

	if (module.hot) {
		module.hot.accept('./App', () => {
			const Next = require('./App').default;
			render(
				<AppContainer>
					<Next />
				</AppContainer>,
				mount
			);
		});
	}
};

console.log('navigator.serviceWorker.controller', navigator.serviceWorker);

if (
	navigator.serviceWorker &&
	navigator.serviceWorker.controller &&
	navigator.serviceWorker.controller.state === 'activated'
) {
	ready();
}

offlineRuntime.install({
	onInstalled() {
		console.log('onInstalled');
		ready();
	},
	onUpdating() {
		console.log('Updating...');
	},
	onUpdateReady: () => {
		console.log('onUpdateReady');
		offlineRuntime.applyUpdate();
	},
	onUpdated: () => {
		console.log('onUpdated');
		// ready();
	},
});
