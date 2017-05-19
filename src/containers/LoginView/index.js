
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Button } from 'antd';

const FormItem = Form.Item;

const styles = {
	container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
		height: '100%',
	},
	title: {
		marginTop: -160,
	},
	form: {
		maxWidth: 300,
		padding: 20,
		border: '1px solid #eee',
		marginTop: 10,
		width: '100%',
	},
	button: {
		width: '100%',
	},
};

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
		authStore: PropTypes.object,
	};

	_handleSubmit = (e) => {
		e.preventDefault();
		const {
			props: { form, location, router },
			context: {
				authStore,
				appConfig: { auth: { defaultLoginRedirection } },
			},
		} = this;
		form.validateFields(async (err, values) => {
			if (!err) {
				const { username, password } = values;
				const isOk = await authStore.login({ username, password });

				if (isOk) {
					const { ref } = location.query;
					const url = ref || defaultLoginRedirection;
					router.replace(url);
				}
			}
		});
	}

	render() {
		const {
			props: { form: { getFieldDecorator } },
			context: { appConfig: { title } },
		} = this;
		return (
			<div style={styles.container}>
				<h1 style={styles.title}>{title}</h1>
				<Form onSubmit={this._handleSubmit} style={styles.form}>
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
						<Button type="primary" htmlType="submit" style={styles.button}>
							登录
						</Button>
					</FormItem>
				</Form>
			</div>
		);
	}
}


