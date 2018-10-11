import React, { Component } from 'react';
import createComponent from './createComponent';
import PropTypes from 'utils/PropTypes';
import Quill from 'react-quill';

class QuilEditorEnhancer extends Component {
	static propTypes = {
		fragment: PropTypes.node,
	};

	render() {
		const { fragment, ...other } = this.props;
		return (
			<div>
				{fragment}
				<Quill {...other} />
			</div>
		);
	}
}

export default createComponent(QuilEditorEnhancer, {
	displayName: 'Editor',
	getValueFromChangeEvent(value) {
		return value;
	},
});
