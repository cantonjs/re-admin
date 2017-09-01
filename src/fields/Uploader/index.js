
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withAppConfig from 'utils/withAppConfig';
import withField from 'utils/withField';
import mapFileList from 'utils/mapFileList';
import { Button, Icon } from 'antd';
import { Upload } from 'components/Nested';

@withField
@withAppConfig('upload')
export default class Uploader extends Component {
	static propTypes = {
		max: PropTypes.number,
		getValue: PropTypes.func.isRequired,
	};

	static defaultProps = {
		max: 1,
	};

	state = {
		fileList: mapFileList(this.props.getValue()),
	};

	componentWillMount() {
		const { authStore, appConfig } = this.context;
		const filePath = this.getAppConfig('filePath');
		const requireAccessToken = this.getAppConfig('requireAccessToken');
		const { accessTokenName } = appConfig.api;

		// TODO: should suppport `accessToken` in header
		const search = requireAccessToken ?
			`?${accessTokenName}=${authStore.accessToken}` : ''
		;
		this._uploadPath = filePath + search;
	}

	_handleChange = ({ fileList }) => {
		this.setState({ fileList });
	};

	render() {
		const {
			props: { max, getValue, ...other },
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
				defaultValue={getValue()}
				action={_uploadPath}
				fileList={fileList}
				onChange={this._handleChange}
				multi={max > 1}
				noFieldDecorator
			>
				{fileList.length < max ? uploadButton : null}
			</Upload>
		);
	}
}
