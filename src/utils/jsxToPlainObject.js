
import { isValidElement } from 'react';

const jsxToPlainObject = function jsxToPlainObject(children) {
	if (isValidElement(children)) {
		return {
			...children.props,
			component: children.type,
		};
	}
	else if (Array.isArray(children)) {
		return children.map(jsxToPlainObject);
	}
	return children;
};

export default jsxToPlainObject;
