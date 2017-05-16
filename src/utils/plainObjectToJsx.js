/* eslint react/prop-types: 0 */

import React, { isValidElement } from 'react';

const plainObjectToJsx = function plainObjectToJsx(json) {
	if (isValidElement(json)) {
		return json;
	}
	else if (Array.isArray(json)) {
		return json.map((data, index) => plainObjectToJsx({
			key: index,
			...data,
		}));
	}

	const { component: Comp = 'div', ...props } = json;
	if (props.children) {
		props.children = plainObjectToJsx(props.children);
	}
	return (<Comp {...props} />);
};

export default plainObjectToJsx;
