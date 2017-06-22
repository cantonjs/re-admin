
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'antd';
import { submittify } from 'react-nested-form';

const { Item } = Form;

@submittify({ onSubmit: 'onClick' })
export default class Submit extends Component {
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
