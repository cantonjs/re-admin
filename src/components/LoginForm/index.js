import styles from './styles';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import routerStore from 'stores/routerStore';
import { Icon } from 'antd';
import { Form, Input, Submit } from 'components/Nested';

export default class LoginForm extends Component {
	static contextTypes = {
		appConfig: PropTypes.object,
		authStore: PropTypes.object,
	};

	state = { isValid: false };

	async _submit(data) {
		const {
			context: { authStore, appConfig: { auth: { defaultLoginRedirection } } },
		} = this;

		const isOk = await authStore.login(data);

		if (isOk) {
			const { ref } = routerStore.location.query;
			const url = ref || defaultLoginRedirection;
			routerStore.history.replace(url);
		}
	}

	_handleValid = () => {
		this.setState({ isValid: true });
	};

	_handleInvalid = () => {
		this.setState({ isValid: false });
	};

	_handleSubmit = (data) => {
		this._submit(data);
	};

	render() {
		const { state: { isValid }, props } = this;
		return (
			<Form
				onSubmit={this._handleSubmit}
				onValid={this._handleValid}
				onInvalid={this._handleInvalid}
				{...props}
			>
				<Input
					required
					name="username"
					prefix={<Icon type="user" style={{ fontSize: 13 }} />}
					placeholder="用户名"
				/>
				<Input
					required
					name="password"
					type="password"
					prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
					placeholder="密码"
				/>
				<Submit
					type="primary"
					style={styles.button}
					wrapperStyle={styles.buttonWrapper}
					disabled={!isValid}
				>
					登录
				</Submit>
			</Form>
		);
	}
}
