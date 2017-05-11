
import $$ from './style.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Field from 'components/Field';
import { Upload, Icon, Modal } from 'antd';

export default class ImageField extends Component {
	static propTypes = {
		max: PropTypes.number,
		render: PropTypes.func,
		strategy: PropTypes.string,
	};

	static defaultProps = {
		max: 1,
		render: (src) => <img src={src} className={$$.thumb} />,
	};

	static contextTypes = {
		appConfig: PropTypes.object,
	};

	state = {
		previewVisible: false,
		previewImage: '',
		fileList: [],
		// fileList: [{
		// 	uid: -1,
		// 	name: 'xxx.png',
		// 	status: 'done',
		// 	url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
		// }],
	};

	componentWillMount() {
		const {
			props: { strategy },
			context: { appConfig: { upload: { strategies } } },
		} = this;
		if (__DEV__ && strategy && !strategies.hasOwnProperty(strategy)) {
			console.warn(
				`Strategy "${strategy}" is NOT defined in config file`
			);
		}
		this.customRequest = strategies[strategy];
	}

	_handleCloseModal = () => this.setState({ previewVisible: false })

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
			props: { max, strategy, ...other },
			state: { previewVisible, previewImage, fileList },
			context: { appConfig: { upload: { imagePath } } },
			customRequest,
		} = this;
		const uploadButton = (
			<div className={$$.uploadButton}>
				<Icon className={$$.uploadButtonIcon} type="plus" />
			</div>
		);
		return (
			<div>
				<Field
					{...other}
					className={$$.container}
					component={Upload}
					customRequest={customRequest}
					action={imagePath}
					listType="picture-card"
					fileList={fileList}
					onPreview={this._handlePreview}
					onChange={this._handleChange}
				>
					{fileList.length < max ? uploadButton : null}
				</Field>
				<Modal
					visible={previewVisible}
					footer={null}
					onCancel={this._handleCloseModal}
				>
					<img className={$$.image} src={previewImage} />
				</Modal>
			</div>
		);
	}
}
