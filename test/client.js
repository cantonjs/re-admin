
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './App';

const mount = document.getElementById('mount');

render(<AppContainer><App /></AppContainer>, mount);

if (module.hot) {
	module.hot.accept('./App', () => {
		const Next = require('./App').default;
		render(
			<AppContainer><Next /></AppContainer>,
			mount
		);
	});
}
