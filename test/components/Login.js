import React, { Component } from 'react';
import { Alert } from 'antd';
import { AppTitle, LoginForm } from '../../src';

const styles = {
	container: {
		padding: 20,
		height: '100%',
	},
	main: {
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
};

export default class Login extends Component {
	render() {
		return (
			<div style={styles.container}>
				<Alert
					message="DEMO"
					description="username: admin, password: 000000"
					type="warning"
					closable
					showIcon
				/>
				<div style={styles.main}>
					<AppTitle style={styles.title} />
					<LoginForm style={styles.form} />
				</div>
			</div>
		);
	}
}
