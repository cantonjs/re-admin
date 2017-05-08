
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Col, Input } from 'antd';

const FormItem = Form.Item;

const formItemLayout = {
	labelCol: { span: 5 },
	wrapperCol: { span: 19 },
};

export default class QueryField extends Component {
	static propTypes = {
		component: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.func,
		]),
		label: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	};

	static defaultProps = {
		component: Input,
	};

	static contextTypes = {
		form: PropTypes.object,
	};

	render() {
		const {
			props: {
				component: Comp,
				label,
				name,
				...other,
			},
			context: {
				form: { getFieldDecorator },
			},
		} = this;
		return (
			<Col span={8}>
				<FormItem {...formItemLayout} label={label}>
					{getFieldDecorator(name)(
						<Comp {...other} />
					)}
				</FormItem>
			</Col>
		);
	}
}
