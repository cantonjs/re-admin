
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'antd';
import { submittify } from 'react-nested-form';

const { Item } = Form;

@submittify({ onSubmit: 'onClick' })
export default class Submit extends Component {
	static propTypes = {
		nest: PropTypes.object.isRequired,
		wrapperStyle: PropTypes.object,
	};

	render() {
		const { nest, wrapperStyle, ...other } = this.props;
		return (
			<Item style={wrapperStyle}>
				<Button {...other} />
			</Item>
		);
	}
}
