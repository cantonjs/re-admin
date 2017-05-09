
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import { withRouter } from 'react-router';
import { returnsArgument } from 'empty-functions';

const FormItem = Form.Item;

// const formItemLayout = {
// 	labelCol: { span: 8 },
// 	wrapperCol: { span: 16 },
// };

const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 8 },
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 16 },
	},
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
		labelCol: PropTypes.object,
		wrapperCol: PropTypes.object,
		dataType: PropTypes.func,
		unique: PropTypes.bool,
		validator: PropTypes.array,
	};

	static defaultProps = {
		component: Input,
		labelCol: { span: 8 },
		wrapperCol: { span: 16 },
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
				labelCol,
				wrapperCol,

				params,
				router,
				routes,
				dataType,
				unique,
				validator,

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
			<FormItem
				label={label}
				labelCol={labelCol}
				wrapperCol={wrapperCol}
			>
				{decorator(
					<Comp {...other} />
				)}
			</FormItem>
		);
	}
}
