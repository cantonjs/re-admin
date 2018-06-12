import React, { Component } from 'react';
import { createRef } from 'utils/reactPolyfill';
import PropTypes from 'prop-types';
import withAppConfig from 'hocs/withAppConfig';
import field from 'hocs/field';
import ensureFileList from 'utils/ensureFileList';
import { Button, Icon } from 'antd';
import { Upload } from 'components/Form';

@field
@withAppConfig(({ upload }) => ({
	requireAccessToken: upload.requireAccessToken,
	mapFileList: upload.mapFileList,
	filePath: upload.filePath,
}))
export default class Uploader extends Component {
	static propTypes = {
		max: PropTypes.number,
		requireAccessToken: PropTypes.bool,
		filePath: PropTypes.string,
		mapFileList: PropTypes.func, // required by `Upload` component
	};

	static defaultProps = {
		max: 1,
	};

	static contextTypes = {
		authStore: PropTypes.object.isRequired,
		appConfig: PropTypes.object.isRequired,
	};

	state = {
		fileList: [],
	};

	uploadRef = createRef();

	constructor(props, context) {
		super(props, context);
		const { authStore, appConfig } = context;
		const { filePath, requireAccessToken } = props;
		const { accessTokenName } = appConfig.api;

		// TODO: should suppport `accessToken` in header
		const search = requireAccessToken ?
			`?${accessTokenName}=${authStore.accessToken}` :
			'';
		this._uploadPath = filePath + search;
	}

	componentDidMount() {
		const value = this.uploadRef.current.getValue();
		this.setState({
			fileList: ensureFileList(value),
		});
	}

	_handleChange = ({ fileList }) => {
		this.setState({ fileList });
	};

	_handleRemove = (...args) => {
		console.log('remove', args);
	};

	render() {
		const {
			props: {
				requireAccessToken,
				filePath,

				max,
				...other
			},
			state: { fileList },
			_uploadPath,
		} = this;

		const uploadButton = (
			<Button>
				<Icon type="upload" /> Upload
			</Button>
		);

		return (
			<Upload
				{...other}
				action={_uploadPath}
				fileList={fileList}
				onChange={this._handleChange}
				multi={max > 1}
				noFieldDecorator
				onRemove={this._handleRemove}
				ref={this.uploadRef}
			>
				{fileList.length < max ? uploadButton : null}
			</Upload>
		);
	}
}
