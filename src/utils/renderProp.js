import React, { isValidElement } from 'react';

export default function renderProp(maybeElement, props) {
	if (!maybeElement) return null;
	if (isValidElement(maybeElement)) return maybeElement;
	const Component = maybeElement;
	return <Component {...props} />;
}
