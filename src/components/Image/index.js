
import $$ from './style.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Field from 'components/Field';
import { Upload, Icon, Modal } from 'antd';
import { UPDATER } from 'constants/Issuers';

export default class ImageField extends Component {
	static propTypes = {
		name: PropTypes.string.isRequired,
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
		store: PropTypes.object,
		form: PropTypes.object,
		issuer: PropTypes.string,
	};

	// state = {
	// 	previewVisible: false,
	// 	previewImage: '',
	// 	// fileList: [],
	// 	// fileList: [{
	// 	// 	uid: -1,
	// 	// 	name: 'xxx.png',
	// 	// 	status: 'done',
	// 	// 	url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
	// 	// }],
	// 	fileList: [{
	// 		url: this.context.store.,
	// 	}],
	// };

	constructor(props, context) {
		super(props, context);

		const { strategy, name } = props;
		const {
			appConfig: { upload: { strategies } },
			store: { selection },
			issuer,
		} = context;

		if (__DEV__ && strategy && !strategies.hasOwnProperty(strategy)) {
			console.warn(
				`Strategy "${strategy}" is NOT defined in config file`
			);
		}
		this.customRequest = strategies[strategy];

		const state = {
			previewVisible: false,
			previewImage: '',
			fileList: [],
		};
		if (issuer === UPDATER && selection.length === 1) {
			const urls = selection[0][name];
			urls
				.split(',')
				.map((url) => url.trim())
				.filter(Boolean)
				.forEach((url, index) => state.fileList.push({ uid: -index, url }))
			;
		}
		this.state = state;
	}

	_handleCloseModal = () => this.setState({ previewVisible: false })

	_handlePreview = (file) => {
		this.setState({
			previewImage: file.url || file.thumbUrl,
			previewVisible: true,
		});
	};

	_handleChange = ({ fileList }) => {
		const url = fileList
			.filter(({ status }) => status === 'done')
			.map(({ thumbUrl }) => thumbUrl)
			.join(',')
		;

		console.log('setFieldsValue', {
			[this.props.name]: url,
		});

		this.context.form.setFieldsValue({
			[this.props.name]: url,
		});
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
					noFieldDecorator
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
