
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { Form, Input, Submit } from 'components/Nested';
import routerStore from 'stores/routerStore';

const styles = {
	container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
		height: '100%',
	},
	title: {
		margin: 10,
	},
	form: {
		maxWidth: 300,
		padding: 20,
		border: '1px solid #eee',
		marginTop: 10,
		width: '100%',
	},
	buttonWrapper: {
		marginBottom: 0,
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

	state = { isValid: false };

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
		const {
			context: { appConfig: { title } },
			state: { isValid },
		} = this;
		return (
			<div style={styles.container}>
				<h1 style={styles.title}>{title}</h1>
				<Form
					onSubmit={this._handleSubmit}
					onValid={this._handleValid}
					onInvalid={this._handleInvalid}
					style={styles.form}
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

			</div>
		);
	}
}


