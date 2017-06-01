
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'antd';
import { submitify } from 'react-nested-form';

const { Item } = Form;

@submitify
export default class Submit extends Component {
	static propTypes = {
		nest: PropTypes.object.isRequired,
	};

	render() {
		const {
			nest: { onClick },
			...other,
		} = this.props;

		return (
			<Item>
				<Button {...other} onClick={onClick} />
			</Item>
		);
	}
}
