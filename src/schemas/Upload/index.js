
import React from 'react';
import PropTypes from 'prop-types';

export default function UploadSchema() {
	return (<noscript />);
}

UploadSchema.propTypes = {
	imagePath: PropTypes.string,
	imageSizeLimit: PropTypes.number,
	filePath: PropTypes.string,
	fileSizeLimit: PropTypes.number,
	strategies: PropTypes.object,
	requireAccessToken: PropTypes.bool,
};

UploadSchema.defaultProps = {
	imagePath: 'upload/image',
	imageSizeLimit: 5120,
	filePath: 'upload/file',
	fileSizeLimit: 10240,
	strategies: {},
	requireAccessToken: false,
};

UploadSchema.setConfig = (props, upload) => {
	Object.assign(upload, props);
};

UploadSchema.schemaName = 'upload';
UploadSchema.DataType = Object;
