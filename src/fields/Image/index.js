import styles from './styles';
import React, { Component } from 'react';
import { createRef } from 'utils/reactPolyfill';
import PropTypes from 'utils/PropTypes';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Icon, Modal } from 'antd';
import { Upload } from 'components/Form';
import withAppConfig from 'hocs/withAppConfig';
import field from 'hocs/field';
import ensureFileList from 'utils/ensureFileList';
import ImageTableCell from './ImageTableCell';
import resizeMode from './resizeMode';
import { isObject } from 'utils/fp';
import warning from 'warning';

@field
@withAppConfig(({ upload }) => ({
	requireAccessToken: upload.requireAccessToken,
	mapFileList: upload.mapFileList,
	imagePath: upload.imagePath,
}))
@observer
export default class ImageField extends Component {
	static propTypes = {
		max: PropTypes.number,
		render: PropTypes.func,
		strategy: PropTypes.stringOrObject,
		thumbStyle: PropTypes.object,
		strategies: PropTypes.any,
		imagePath: PropTypes.string,
		requireAccessToken: PropTypes.bool,
		mapFileList: PropTypes.func, // required by `Upload` component
	};

	static defaultProps = {
		max: 1,
	};

	static contextTypes = {
		authStore: PropTypes.object.isRequired,
		appConfig: PropTypes.object.isRequired,
	};

	static resizeMode = resizeMode;

	static BLANK_IMAGE = ImageTableCell.BLANK_IMAGE;

	static renderTable(props, { text }) {
		return <ImageTableCell {...props} url={text} />;
	}

	@observable fileList = [];
	@observable previewVisible = false;
	@observable previewImage = '';

	constructor(props, context) {
		super(props, context);

		const { strategy, imagePath, requireAccessToken } = props;
		const { authStore, appConfig } = context;
		const { accessTokenName } = appConfig.api;

		if (isObject(strategy)) {
			this._customRequest = strategy;
		} else if (strategy) {
			const { strategies } = appConfig.upload;
			__DEV__ &&
				warning(
					strategies.hasOwnProperty(strategy),
					`Strategy "${strategy}" is NOT defined in config file`
				);
			this._customRequest = strategies[strategy];
		}

		// TODO: should suppport `accessToken` in header
		const search = requireAccessToken ?
			`?${accessTokenName}=${authStore.accessToken}` :
			'';
		this._uploadPath = imagePath + search;
		this.uploadRef = createRef();
	}

	componentDidMount() {
		const value = this.uploadRef.current.getValue();
		this.fileList = ensureFileList(value);
	}

	@action
	_handleCloseModal = () => {
		this.previewVisible = false;
	};

	@action
	_handlePreview = (file) => {
		this.previewImage = file.url || file.thumbUrl;
		this.previewVisible = true;
	};

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
			props: { max, strategy, thumbStyle, ...other },
			previewVisible,
			previewImage,
			fileList,
			_customRequest,
			_uploadPath,
		} = this;

		const uploadButton = (
			<div style={styles.uploadButton}>
				<Icon style={styles.uploadButtonIcon} type="plus" />
			</div>
		);

		return (
			<div>
				<Upload
					{...other}
					style={styles.container}
					customRequest={_customRequest}
					action={_uploadPath}
					listType="picture-card"
					fileList={fileList}
					onPreview={this._handlePreview}
					onChange={this._handleChange}
					onRemove={this._handleRemove}
					multi={max > 1}
					noFieldDecorator
					ref={this.uploadRef}
				>
					{fileList.length < max ? uploadButton : null}
				</Upload>
				<Modal
					visible={previewVisible}
					footer={null}
					onCancel={this._handleCloseModal}
				>
					<img style={styles.image} src={previewImage} />
				</Modal>
			</div>
		);
	}
}
