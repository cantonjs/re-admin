
import $$ from './style.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { name } from 'config/app.js';
import cookie from 'utils/cookie';
import fakeLogin from 'utils/fakeLogin';

const FormItem = Form.Item;

@Form.create()
export default class Login extends Component {
	static propTypes = {
		form: PropTypes.object.isRequired,
		location: PropTypes.shape({
			query: PropTypes.object,
		}),
		router: PropTypes.shape({
			replace: PropTypes.func,
		}),
	};

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields(async (err, values) => {
			if (!err) {
				const { username, password } = values;
				console.log('Received values of form: ', values);
				const { accessToekn, error } = await fakeLogin({ username, password });
				if (error) {
					console.error(error);
				}
				else {
					const { ref } = this.props.location;
					cookie.set('accessToekn', accessToekn, { maxAge: 60 * 60 * 24 * 7 });
					const url = ref || '/';
					this.props.router.replace(url);
				}

			}
		});
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<div className={$$.container}>
				<h1 className={$$.title}>{ name }</h1>
				<Form onSubmit={this.handleSubmit} className={$$.form}>
					<FormItem>
						{getFieldDecorator('username', {
							rules: [{ required: true, message: 'Please input your username!' }],
						})(
							<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
						)}
					</FormItem>
					<FormItem>
						{getFieldDecorator('password', {
							rules: [{ required: true, message: 'Please input your Password!' }],
						})(
							<Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
						)}
					</FormItem>
					<FormItem>
						<Button type="primary" htmlType="submit" className={$$.bt}>
							Log in
						</Button>
					</FormItem>
				</Form>
			</div>
		);
	}
}


