
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Col, Input } from 'antd';
import { withRouter } from 'react-router';
import { returnsArgument } from 'empty-functions';

const FormItem = Form.Item;

const formItemLayout = {
	labelCol: { span: 5 },
	wrapperCol: { span: 19 },
};

@withRouter
export default class Field extends Component {
	static propTypes = {
		component: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.func,
		]),
		label: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		location: PropTypes.shape({
			query: PropTypes.object.isRequired,
		}).isRequired,
		params: PropTypes.any.isRequired,
		router: PropTypes.any.isRequired,
		routes: PropTypes.any.isRequired,
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
				location: { query },

				params,
				router,
				routes,

				...other,
			},
			context: { form },
		} = this;

		const decoratorFn = form && form.getFieldDecorator;
		const decorator = decoratorFn ?
			decoratorFn(name, { initialValue: query[name] }) :
			returnsArgument
		;

		return (
			<Col span={8}>
				<FormItem {...formItemLayout} label={label}>
					{decorator(
						<Comp {...other} />
					)}
				</FormItem>
			</Col>
		);
	}
}
