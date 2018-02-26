import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './Root';

const mount = document.getElementById('mount');

render(
	<AppContainer>
		<Root />
	</AppContainer>,
	mount
);

if (module.hot) {
	module.hot.accept('./Root', () => {
		const Next = require('./Root').default;
		render(
			<AppContainer>
				<Next />
			</AppContainer>,
			mount
		);
	});
}
