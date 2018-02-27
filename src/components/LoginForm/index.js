import styles from './styles';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import routerStore from 'stores/routerStore';
import localeStore from 'stores/localeStore';
import { Icon } from 'antd';
import { Form, Input, Submit } from 'components/Nested';

@observer
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
		const locale = localeStore.LoginForm;
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
					placeholder={locale.usernamePlaceholder}
				/>
				<Input
					required
					name="password"
					type="password"
					prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
					placeholder={locale.passwordPlaceholder}
				/>
				<Submit
					type="primary"
					style={styles.button}
					wrapperStyle={styles.buttonWrapper}
					disabled={!isValid}
				>
					{locale.login}
				</Submit>
			</Form>
		);
	}
}
