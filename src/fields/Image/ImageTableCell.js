
import styles from './styles';
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import { Modal } from 'antd';
import resizeMode from './resizeMode';
import { returnsArgument } from 'empty-functions';

export default class ImageTableCell extends Component {
	static propTypes = {
		url: PropTypes.string,
		thumbHeight: PropTypes.stringOrNumber,
		thumbWidth: PropTypes.stringOrNumber,
		resizeMode: PropTypes.oneOf(Object.keys(resizeMode).map(returnsArgument)),
		thumbStyle: PropTypes.object,
	};

	static defaultProps = {
		thumbWidth: 64,
		thumbHeight: 64,
		resizeMode: 'fill',
	};

	state = {
		previewVisible: false,
	};

	_handleCloseModal = () => {
		this.setState({ previewVisible: false });
	};

	_handlePreview = () => {
		this.setState({ previewVisible: true });
	};

	render() {
		const {
			props: { url, thumbWidth, thumbHeight, resizeMode, thumbStyle },
			state: { previewVisible },
		} = this;
		return (
			<div>
				<Modal
					visible={previewVisible}
					footer={null}
					onCancel={this._handleCloseModal}
				>
					<img style={styles.image} src={url} />
				</Modal>
				<img
					src={url}
					style={{
						...styles.thumb,
						width: thumbWidth,
						height: thumbHeight,
						objectFit: resizeMode,
						...thumbStyle,
					}}
					onClick={this._handlePreview}
				/>
			</div>
		);
	}
}
