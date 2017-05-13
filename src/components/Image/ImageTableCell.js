
import $$ from './style.scss';
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import { Modal } from 'antd';

export default class ImageTableCell extends Component {
	static propTypes = {
		url: PropTypes.string,
		thumbHeight: PropTypes.stringOrNumber,
		thumbWidth: PropTypes.stringOrNumber,
	};

	static defaultProps = {
		thumbWidth: 64,
		thumbHeight: 64,
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
			props: { url, thumbWidth, thumbHeight, },
			state: { previewVisible },
		} = this;
		return (
			<div>
				<Modal
					visible={previewVisible}
					footer={null}
					onCancel={this._handleCloseModal}
				>
					<img className={$$.image} src={url} />
				</Modal>
				<img
					src={url}
					className={$$.thumb}
					onClick={this._handlePreview}
					style={{ width: thumbWidth, height: thumbHeight }}
				/>
			</div>
		);
	}
}
