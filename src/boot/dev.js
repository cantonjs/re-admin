
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Admin from 'containers/Admin';

const mount = document.getElementById('mount');

render(<AppContainer><Admin /></AppContainer>, mount);

if (module.hot) {
	module.hot.accept('../containers/Admin', () => {
		const Next = require('../containers/Admin').default;
		render(
			<AppContainer><Next /></AppContainer>,
			mount
		);
	});
}
