import styles from './styles';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import routerStore from 'stores/routerStore';
import authStore from 'stores/authStore';
import localize from 'hocs/localize';
import { Icon } from 'antd';
import { Form, Input, Submit } from 'components/Form';

@localize('LoginForm')
@observer
export default class SetPasswordForm extends Component {
	static propTypes = {
		localeStore: PropTypes.object.isRequired,
	};

	static defaultProps = {
		fields: [],
	};

	static contextTypes = {
		appConfig: PropTypes.object,
	};

	state = { isValid: true, isPosting: false };

	async _submit(data) {
		const {
			context: {
				appConfig: {
					auth: { defaultLoginRedirection },
				},
			},
		} = this;

		this.setState({ isPosting: true });
		const isOk = await authStore.login(data);
		this.setState({ isPosting: false });

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
		const {
			state: { isValid, isPosting },
			props: { localeStore, ...props },
		} = this;
		return (
			<Form
				onSubmit={this._handleSubmit}
				onValid={this._handleValid}
				onInvalid={this._handleInvalid}
				{...props}
			>
				<Input
					required
					name="oldPassword"
					type="password"
					prefix={<Icon type="lock" style={styles.icon} />}
					placeholder={localeStore.data.passwordPlaceholder}
				/>
				<Input
					required
					name="newPassword"
					type="password"
					prefix={<Icon type="lock" style={styles.icon} />}
					placeholder={localeStore.data.passwordPlaceholder}
				/>
				<Input
					required
					name="confirm"
					type="password"
					prefix={<Icon type="lock" style={styles.icon} />}
					placeholder={localeStore.data.passwordPlaceholder}
				/>
				<Submit
					type="primary"
					style={styles.button}
					wrapperStyle={styles.buttonWrapper}
					disabled={!isValid}
					loading={isPosting}
				>
					{localeStore.data.login}
				</Submit>
			</Form>
		);
	}
}
