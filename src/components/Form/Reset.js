import React, { Component } from 'react';
import { createRef } from 'utils/reactPolyfill';
import PropTypes from 'prop-types';
import { Form, Button } from 'antd';
import { DemonButton } from 'react-form-mobx';

const { Item } = Form;

export default class Reset extends Component {
	static propTypes = {
		wrapperStyle: PropTypes.object,
	};

	demonButtonRef = createRef();

	handleClick = (ev) => {
		ev.preventDefault();
		const demon = this.demonButtonRef.current;
		demon.clear();
		demon.submit();
	};

	render() {
		const { wrapperStyle, ...props } = this.props;
		return (
			<DemonButton forwardedProps={props} ref={this.demonButtonRef}>
				{(forwardedProps) => (
					<Item style={wrapperStyle}>
						<Button {...forwardedProps} onClick={this.handleClick} />
					</Item>
				)}
			</DemonButton>
		);
	}
}
