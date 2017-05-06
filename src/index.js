
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from 'containers/Root';

const mount = document.getElementById('mount');

render(<AppContainer><Root /></AppContainer>, mount);

if (module.hot) {
	module.hot.accept('./containers/Root', () => {
		const NextRoot = require('./containers/Root').default;
		render(
			<AppContainer><NextRoot /></AppContainer>,
			mount
		);
	});
}
