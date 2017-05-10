
import { isValidElement } from 'react';

export default function jsxToPlainObject(jsxSchema) {
	if (!isValidElement(jsxSchema)) { return jsxSchema; }

	const { children, ...other } = jsxSchema.props;

	if (children) {
		return children.map(({ props, type }) => ({
			...props,
			component: type,
		}));
	}

	return other;
};
