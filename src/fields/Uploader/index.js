import React, { Component } from 'react';
import { createRef } from 'utils/reactPolyfill';
import PropTypes from 'prop-types';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
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
@observer
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

	@observable fileList = [];

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
		this.uploadRef = createRef();
	}

	componentDidMount() {
		const value = this.uploadRef.current.getValue();
		this.fileList = ensureFileList(value);
	}

	@action
	_handleChange = ({ fileList }) => {
		this.fileList = fileList;
	};

	@action
	_handleRemove = (file) => {
		const index = this.fileList.findIndex(({ id }) => id === file.id);
		const shouldRemove = index > -1;
		if (shouldRemove) this.fileList.splice(index, 1);
	};

	render() {
		const {
			props: {
				requireAccessToken,
				filePath,

				max,
				...other
			},
			_uploadPath,
			fileList,
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
				multiple={max > 1}
				noFieldDecorator
				onRemove={this._handleRemove}
				ref={this.uploadRef}
			>
				{fileList.length < max ? uploadButton : null}
			</Upload>
		);
	}
}
