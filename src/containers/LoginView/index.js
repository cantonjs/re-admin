
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { Form, Input, Submit } from 'components/Nested';
import routerStore from 'stores/router';

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

export default class LoginView extends Component {
	static contextTypes = {
		appConfig: PropTypes.object,
		authStore: PropTypes.object,
	};

	async _submit(data) {
		const {
			context: {
				authStore,
				appConfig: { auth: { defaultLoginRedirection } },
			},
		} = this;

		const isOk = await authStore.login(data);

		if (isOk) {
			const { ref } = routerStore.location.query;
			const url = ref || defaultLoginRedirection;
			routerStore.history.replace(url);
		};
	}

	_handleSubmit = (data) => {
		this._submit(data);
	};

	render() {
		const {
			context: { appConfig: { title } },
		} = this;
		return (
			<div style={styles.container}>
				<h1 style={styles.title}>{title}</h1>
				<Form onSubmit={this._handleSubmit} style={styles.form}>
					<Input
						required
						name="username"
						prefix={<Icon type="user" style={{ fontSize: 13 }} />}
						placeholder="用户名"
					/>
					<Input
						name="password"
						type="password"
						prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
						placeholder="密码"
					/>
					<Submit type="primary" style={styles.button}>登录</Submit>
				</Form>

			</div>
		);
	}
}


