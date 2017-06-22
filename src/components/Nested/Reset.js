
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'antd';
import { submittify } from 'react-nested-form';

const { Item } = Form;

@submittify({ onReset: 'onClick' })
export default class Reset extends Component {
	static propTypes = {
		nest: PropTypes.object.isRequired,
	};

	render() {
		const { nest, ...other } = this.props;
		return (
			<Item>
				<Button {...other} />
			</Item>
		);
	}
}
