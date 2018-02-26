import styles from './styles';
import React from 'react';
import AppTitle from 'components/AppTitle';
import LoginForm from 'components/LoginForm';

export default function LoginView() {
	return (
		<div style={styles.container}>
			<AppTitle style={styles.title} />
			<LoginForm style={styles.form} />
		</div>
	);
}
