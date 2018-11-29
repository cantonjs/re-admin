import React, { Component } from 'react';
import { FormBody, Text, Select, Option, Submit } from '../../src';
import { Modal } from 'antd';

export default class CustomFormPage extends Component {
	_handleSubmit = (data) => {
		Modal.info({
			title: 'Submit data',
			content: (
				<pre style={{ background: '#f9f9f9', padding: 20 }}>
					<code>{JSON.stringify(data, null, 2)}</code>
				</pre>
			),
		});
	};

	render() {
		return (
			<FormBody onSubmit={this._handleSubmit}>
				<Text name="foo" label="Foo" />
				<Select name="bar" label="Bar">
					<Option value="A">A</Option>
					<Option value="B">B</Option>
				</Select>
				<Submit>OK</Submit>
			</FormBody>
		);
	}
}
