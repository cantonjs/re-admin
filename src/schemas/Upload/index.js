import React from 'react';
import PropTypes from 'prop-types';

export default function UploadSchema() {
	return <noscript />;
}

UploadSchema.propTypes = {
	imagePath: PropTypes.string,
	imageSizeLimit: PropTypes.number,
	filePath: PropTypes.string,
	fileSizeLimit: PropTypes.number,
	strategies: PropTypes.object,
	requireAccessToken: PropTypes.bool,
	mapFileList: PropTypes.func,
};

UploadSchema.defaultProps = {
	imagePath: 'upload/image',
	imageSizeLimit: 5120,
	filePath: 'upload/file',
	fileSizeLimit: 10240,
	strategies: {},
	requireAccessToken: false,
	mapFileList: (fileList) => {
		return fileList
			.filter(({ status }) => status === 'done')
			.map(({ thumbUrl, response }) => response.url || thumbUrl)
			.join(',');
	},
};

UploadSchema.configuration = {
	name: 'upload',
	pipe: (props, config) => Object.assign(config, props),
};
