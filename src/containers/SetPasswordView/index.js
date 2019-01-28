import styles from './styles';
import React from 'react';
import AppTitle from 'components/AppTitle';
import SetPasswordForm from 'components/SetPasswordForm';

export default function SetPasswordView() {
	return (
		<div style={styles.container}>
			<AppTitle style={styles.title} />
			<SetPasswordForm style={styles.form} />
		</div>
	);
}
