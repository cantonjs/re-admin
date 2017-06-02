
import styles from './styles';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Modal } from 'antd';
import { Upload } from 'components/Nested';
import withAppConfig from 'utils/withAppConfig';
import withField from 'utils/withField';
import ImageTableCell from './ImageTableCell';

@withField
@withAppConfig('upload')
export default class ImageField extends Component {
	static propTypes = {
		max: PropTypes.number,
		render: PropTypes.func,
		strategy: PropTypes.string,
		getValue: PropTypes.func.isRequired,
	};

	static defaultProps = {
		max: 1,
		render: (src, records, index, props) =>
			<ImageTableCell {...props} url={src} />
		,
	};

	static contextTypes = {
		authStore: PropTypes.object.isRequired,
		appConfig: PropTypes.object.isRequired,
	};

	constructor(props, context) {
		super(props, context);

		const { strategy, getValue } = props;
		const { authStore } = context;
		const strategies = this.getAppConfig('strategies');
		const imagePath = this.getAppConfig('imagePath');
		const requireAccessToken = this.getAppConfig('requireAccessToken');
		const { accessTokenName } = context.appConfig.api;

		if (__DEV__ && strategy && !strategies.hasOwnProperty(strategy)) {
			console.warn(
				`Strategy "${strategy}" is NOT defined in config file`
			);
		}
		this._customRequest = strategies[strategy];

		// TODO: should suppport `accessToken` in header
		const search = requireAccessToken ?
			`?${accessTokenName}=${authStore.getAccessToken()}` : ''
		;
		this._uploadPath = imagePath + search;

		const state = {
			previewVisible: false,
			previewImage: '',
			fileList: [],
		};

		(getValue() || '')
			.split(',')
			.map((url) => url.trim())
			.filter(Boolean)
			.forEach((url, index) => state.fileList.push({ uid: -index, url }))
		;

		this.state = state;
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
			props: {
				max, strategy,
				getValue,
				...other,
			},
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
