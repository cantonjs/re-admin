
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'antd';
import { submitify } from 'react-nested-form';

const { Item } = Form;

@submitify
export default class Reset extends Component {
	static propTypes = {
		nest: PropTypes.object.isRequired,
		onClick: PropTypes.func,
	};

	_handleClick = (ev) => {
		const { onClick, nest } = this.props;
		nest.reset();
		onClick && onClick(ev);
	};

	render() {
		const {
			nest,
			...other,
		} = this.props;

		return (
			<Item>
				<Button {...other} onClick={this._handleClick} />
			</Item>
		);
	}
}
