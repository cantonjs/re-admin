
import $$ from './style.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Button } from 'antd';
import authStore from 'stores/auth';

const FormItem = Form.Item;

@Form.create()
export default class LoginView extends Component {
	static propTypes = {
		form: PropTypes.object.isRequired,
		location: PropTypes.shape({
			query: PropTypes.object,
		}),
		router: PropTypes.shape({
			replace: PropTypes.func,
		}),
	};

	static contextTypes = {
		appConfig: PropTypes.object,
	};

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields(async (err, values) => {
			if (!err) {
				const { username, password } = values;
				const isOk = await authStore.login({ username, password });

				if (isOk) {
					const { ref } = this.props.location.query;
					const url = ref || '/';
					this.props.router.replace(url);
				}
			}
		});
	}

	render() {
		const {
			props: { form: { getFieldDecorator } },
			context: { appConfig: { name } },
		} = this;
		return (
			<div className={$$.container}>
				<h1 className={$$.title}>{name}</h1>
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


