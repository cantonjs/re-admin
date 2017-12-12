
import React from 'react';
import PropTypes from 'utils/PropTypes';

export default function ErrorMessagesSchema() {
	return (<noscript />);
}

ErrorMessagesSchema.propTypes = {
	defaults: PropTypes.string,
	statusMap: PropTypes.object,
	validResponse: PropTypes.func,
	validResponseData: PropTypes.func,
	getMessage: PropTypes.func,
};

ErrorMessagesSchema.setConfig = (props, errorMessages) => {
	Object.assign(errorMessages, props);
};
ErrorMessagesSchema.schemaName = 'errorMessages';
ErrorMessagesSchema.DataType = Object;
