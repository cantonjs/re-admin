import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ModalConsumer } from '../../src';

export default class FooModal extends Component {
	static propTypes = {
		title: PropTypes.node,
	};

	render() {
		return (
			<ModalConsumer title={this.props.title} footer={<span>footer</span>}>
				<span>custom modal</span>
			</ModalConsumer>
		);
	}
}
