import React from 'react';
import PropTypes from 'prop-types';

export default function TitleSchema() {
	return <noscript />;
}

TitleSchema.propTypes = {
	children: PropTypes.string.isRequired,
};

TitleSchema.configuration = {
	name: 'title',
	propType: PropTypes.string,
	pipe: ({ children }) => children,
	initialData: 'Admin',
};
