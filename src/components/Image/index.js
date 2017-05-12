
import $$ from './style.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Field from 'components/Field';
import { Upload, Icon, Modal } from 'antd';
import { UPDATER } from 'constants/Issuers';
import withAppConfig from 'utils/withAppConfig';

@withAppConfig('upload')
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
		store: PropTypes.object,
		auth: PropTypes.object,
		form: PropTypes.object,
		issuer: PropTypes.string,
	};

	constructor(props, context) {
		super(props, context);

		const { strategy, name } = props;
		const {
			store: { selection },
			issuer,
			auth,
		} = context;
		const strategies = this.getAppConfig('strategies');
		const imagePath = this.getAppConfig('imagePath');
		const requireAccessToken = this.getAppConfig('requireAccessToken');

		if (__DEV__ && strategy && !strategies.hasOwnProperty(strategy)) {
			console.warn(
				`Strategy "${strategy}" is NOT defined in config file`
			);
		}
		this._customRequest = strategies[strategy];

		const search = requireAccessToken ?
			`?accessToken=${auth.getAccessToken()}` : ''
		;
		this._uploadPath = imagePath + search;

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
		this.setState({ fileList });
	};

	_getValueFromEvent = ({ fileList }) => {
		const urls = fileList
			.filter(({ status }) => status === 'done')
			.map(({ thumbUrl, response }) => response.url || thumbUrl)
			.join(',')
		;
		return urls;
	};

	render() {
		const {
			props: { max, strategy, name, ...other },
			state: { previewVisible, previewImage, fileList },
			context: { form },
			_customRequest,
			_uploadPath,
		} = this;

		const decorator = form.getFieldDecorator(name, {
			getValueFromEvent: this._getValueFromEvent,
		});

		const uploadButton = (
			<div className={$$.uploadButton}>
				<Icon className={$$.uploadButtonIcon} type="plus" />
			</div>
		);

		return (
			<div>
				{decorator(
					<Field
						{...other}
						name={name}
						className={$$.container}
						component={Upload}
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
					</Field>
				)}
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
