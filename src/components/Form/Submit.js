import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'antd';
import { DemonButton } from 'react-form-mobx';

const { Item } = Form;

export default class Submit extends Component {
	static propTypes = {
		wrapperStyle: PropTypes.object,
	};

	render() {
		const { wrapperStyle, ...props } = this.props;
		return (
			<DemonButton forwardedProps={props} type="submit">
				{(forwardedProps) => (
					<Item style={wrapperStyle}>
						<Button {...forwardedProps} />
					</Item>
				)}
			</DemonButton>
		);
	}
}
