import styles from './styles';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import routerStore from 'stores/routerStore';
import localize from 'hocs/localize';
import { Icon } from 'antd';
import { Form, Input, Submit } from 'components/Form';

@localize('LoginForm')
@observer
export default class LoginForm extends Component {
	static propTypes = {
		localeStore: PropTypes.object.isRequired,
		fields: PropTypes.arrayOf(
			PropTypes.shape({
				name: PropTypes.string.isRequired,
				icon: PropTypes.string,
				placeholder: PropTypes.string,
				required: PropTypes.bool,
			})
		),
	};

	static defaultProps = {
		fields: [],
	};

	static contextTypes = {
		appConfig: PropTypes.object,
		authStore: PropTypes.object,
	};

	state = { isValid: true, isPosting: false };

	async _submit(data) {
		const {
			context: {
				authStore,
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
			props: { localeStore, fields, ...props },
		} = this;
		return (
			<Form
				onSubmit={this._handleSubmit}
				onValid={this._handleValid}
				onInvalid={this._handleInvalid}
				{...props}
			>
				{fields.length > 0 ? (
					fields.map(({ icon, ...restProps }, index) => (
						<Input
							key={index}
							{...restProps}
							prefix={<Icon type={icon} style={styles.icon} />}
						/>
					))
				) : (
					<Input
						required
						name="username"
						prefix={<Icon type="user" style={styles.icon} />}
						placeholder={localeStore.data.usernamePlaceholder}
					/>
				)}
				<Input
					required
					name="password"
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
