import styles from './styles';
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import { Icon, Modal } from 'antd';
import { Upload } from 'components/Nested';
import withAppConfig from 'hoc/withAppConfig';
import field from 'hoc/field';
import ensureFileList from 'utils/ensureFileList';
import ImageTableCell from './ImageTableCell';
import resizeMode from './resizeMode';
import { isObject } from 'lodash';
import warning from 'warning';

@field
@withAppConfig(({ upload }) => ({
	requireAccessToken: upload.requireAccessToken,
	mapFileList: upload.mapFileList,
	imagePath: upload.imagePath,
}))
export default class ImageField extends Component {
	static propTypes = {
		max: PropTypes.number,
		render: PropTypes.func,
		strategy: PropTypes.stringOrObject,
		getValue: PropTypes.func.isRequired,
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

	static renderTable(props, { text }) {
		return <ImageTableCell {...props} url={text} />;
	}

	_strategy = this.props;

	state = {
		fileList: ensureFileList(this.props.getValue()),
		previewVisible: false,
		previewImage: '',
	};

	componentWillMount() {
		const { strategy, imagePath, requireAccessToken } = this.props;
		const { authStore, appConfig } = this.context;
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
	}

	_handleCloseModal = () => {
		this.setState({ previewVisible: false });
	};

	_handlePreview = (file) => {
		this.setState({
			previewImage: file.url || file.thumbUrl,
			previewVisible: true,
		});
	};

	_handleChange = ({ fileList }) => {
		this.setState({ fileList });
	};

	render() {
		const {
			props: { max, strategy, getValue, thumbStyle, ...other },
			state: { previewVisible, previewImage, fileList },
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
					defaultValue={getValue()}
					style={styles.container}
					customRequest={_customRequest}
					action={_uploadPath}
					listType="picture-card"
					fileList={fileList}
					onPreview={this._handlePreview}
					onChange={this._handleChange}
					multi={max > 1}
					noFieldDecorator
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
