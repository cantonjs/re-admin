
import React, { Children } from 'react';
import { isString } from 'lodash';

const context = require.context('components', true, /index\.js$/);

const getComponent = function getComponent(name) {
	const result = context(`./${name}/index.js`);
	return result.default || result;
};

export function getComponents(children = []) {
	return Children.toArray(children).filter(Boolean).map((child) => {
		if (isString(child.type)) {
			const Comp = getComponent(child.type);
			return (<Comp {...child.props} key={child.key} />);
		}
		return child;
	});
}

export { context };
