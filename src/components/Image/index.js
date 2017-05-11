
import $$ from './style.scss';
import React, { Component } from 'react';
import Field from 'components/Field';
import { Upload, Icon } from 'antd';

function getBase64(img, callback) {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result));
	reader.readAsDataURL(img);
}

export default class ImageField extends Component {
	state = {};

	_handleBeforeUpload = (file, filelist) => {
		console.log('file', file, filelist);
		return false;
	};

	_handleChange = (info) => {
		if (info.file.status === 'done') {
			getBase64(
				info.file.originFileObj,
				(imageUrl) => this.setState({ imageUrl }),
			);
		}
	};

	render() {
		const { props, state: { imageUrl } } = this;
		return (
			<Field
				{...props}
				className={$$.container}
				component={Upload}
				// action="//jsonplaceholder.typicode.com/posts/"
				beforeUpload={this._handleBeforeUpload}
				onChange={this._handleChange}
			>
				{imageUrl ?
					<img src={imageUrl} className={$$.image} /> :
					<Icon type="plus" className={$$.icon} />
				}
			</Field>
		);
	}
}
