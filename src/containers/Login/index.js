
import $$ from './style.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Button } from 'antd';
import { name } from 'config/app.js';
import cookie from 'utils/cookie';
import authStore from 'stores/Auth';


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
				await authStore.login({ username, password });
				const { ref } = this.props.location.query;
				const url = ref || '/';
				this.props.router.replace(url);
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
							rules: [{ required: true, message: '请输入用户名!' }],
						})(
							<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
						)}
					</FormItem>
					<FormItem>
						{getFieldDecorator('password', {
							rules: [{ required: true, message: '请输入密码!' }],
						})(
							<Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
						)}
					</FormItem>
					<FormItem>
						<Button type="primary" htmlType="submit" className={$$.bt}>
							登录
						</Button>
					</FormItem>
				</Form>
			</div>
		);
	}
}


