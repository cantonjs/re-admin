import React from 'react';
import PropTypes from 'prop-types';

export default function LocaleSchema() {
	return <noscript />;
}

LocaleSchema.propTypes = {
	children: PropTypes.object.isRequired,
};

LocaleSchema.configuration = {
	name: 'locale',
	propType: PropTypes.object,
	pipe: ({ children }) => children,
	initialData: null,
};
