import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'antd';
import { DemonButton } from 'react-form-mobx';

const { Item } = Form;

export default class Reset extends Component {
	static propTypes = {
		wrapperStyle: PropTypes.object,
	};

	render() {
		const { wrapperStyle, ...props } = this.props;
		return (
			<DemonButton forwardedProps={props} type="reset">
				{(forwardedProps) => (
					<Item style={wrapperStyle}>
						<Button {...forwardedProps} />
					</Item>
				)}
			</DemonButton>
		);
	}
}
