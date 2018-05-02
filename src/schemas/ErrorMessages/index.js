import React from 'react';
import PropTypes from 'utils/PropTypes';

export default function ErrorMessagesSchema() {
	return <noscript />;
}

ErrorMessagesSchema.propTypes = {
	defaults: PropTypes.string,
	statusMap: PropTypes.object,
	validResponse: PropTypes.func,
	validResponseData: PropTypes.func,
	getMessage: PropTypes.func,
};

ErrorMessagesSchema.configuration = {
	name: 'errorMessages',
	propType: PropTypes.object,
	pipe: (props, messages) => Object.assign(messages, props),
};
