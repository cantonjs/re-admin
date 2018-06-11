import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'antd';
import { DemonButton } from 'react-form-mobx';

const { Item } = Form;

export default class Clear extends Component {
	static propTypes = {
		wrapperStyle: PropTypes.object,
	};

	render() {
		const { wrapperStyle, ...props } = this.props;
		return (
			<DemonButton forwardedProps={props} type="clear">
				{(forwardedProps) => (
					<Item style={wrapperStyle}>
						<Button {...forwardedProps} />
					</Item>
				)}
			</DemonButton>
		);
	}
}
