import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import { observer } from 'mobx-react';
import warning from 'warning';
import FormStore from 'stores/FormStore';
import { Form } from 'components/Form';
import FormItem from 'components/FormItem';
import SpinBox from 'components/SpinBox';

@observer
export default class FormBody extends Component {
	static propTypes = {
		store: PropTypes.object,
		children: PropTypes.node,
		selectedKeys: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
		value: PropTypes.any,
		footer: PropTypes.node,
		formRef: PropTypes.any,
		onChange: PropTypes.func,
		onSubmit: PropTypes.func,
		onValidChange: PropTypes.func,
		onStatusChange: PropTypes.func,
	};

	formStore = new FormStore();

	isPristine = true;
	isValid = true;
	isOk = false;

	_handleChange = (state) => {
		const { onChange } = this.props;
		onChange && onChange(state);
		this.formStore.setState(state.value);
		if (this.isPristine) {
			this.isPristine = false;
			this._handleStatusChange();
		}
	};

	_handleValidChange = (isValid) => {
		const { onValidChange } = this.props;
		onValidChange && onValidChange(isValid);
		this.isValid = isValid;
		this._handleStatusChange();
	};

	_handleStatusChange() {
		const { onStatusChange } = this.props;
		if (onStatusChange) {
			const ok = !this.isPristine && this.isValid;
			if (this.isOk !== ok) {
				this.isOk = ok;
				onStatusChange(ok);
			}
		}
	}

	_handleSubmit = (body, state) => {
		if (!state.isInvalid) {
			const {
				props: { onSubmit, selectedKeys },
			} = this;
			const options = { selectedKeys };
			if (onSubmit) {
				onSubmit(body, state, options);
			}
		} else if (__DEV__) {
			warning(false, 'INVALID');
		}
	};

	render() {
		const {
			props: {
				store,
				children,
				value,
				formRef,
				footer,
				selectedKeys,
				onStatusChange,
				...other
			},
			formStore,
		} = this;
		if (store && store.isFetching) return <SpinBox />;
		return (
			<Form
				{...other}
				ref={formRef}
				value={value}
				onSubmit={this._handleSubmit}
				onChange={this._handleChange}
				onValidChange={this._handleValidChange}
			>
				{store &&
					store.renderers.map(({ renderForm }, index) => (
						<FormItem
							renderForm={renderForm}
							formStore={formStore}
							key={index}
						/>
					))}
				{children}
				{footer}
			</Form>
		);
	}
}
