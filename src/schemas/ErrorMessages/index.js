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
	pipe: (props, messages) => Object.assign(messages, props),
	name: 'errorMessages',
};
