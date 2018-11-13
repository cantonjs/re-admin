import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import { observer } from 'mobx-react';
import warning from 'warning';
import FormStore from 'stores/FormStore';
import { Form } from 'components/Form';
import FormItem from 'components/FormItem';
import SpinBox from 'components/SpinBox';

@observer
class FormBody extends Component {
	static propTypes = {
		store: PropTypes.object.isRequired,
		value: PropTypes.any,
		footer: PropTypes.node,
		formRef: PropTypes.any,
		onChange: PropTypes.func,
		onSubmit: PropTypes.func,
		onValidChange: PropTypes.func,
	};

	formStore = new FormStore();

	_handleChange = (state) => {
		const { onChange } = this.props;
		onChange && onChange(state);
		this.formStore.setState(state.value);
	};

	_handleSubmit = (body, state) => {
		if (!state.isInvalid) {
			const { onSubmit } = this.props;
			onSubmit && onSubmit(body, state);
		} else if (__DEV__) {
			warning(false, 'INVALID');
		}
	};

	render() {
		const {
			props: { store: { renderers }, value, formRef, footer, ...other },
			formStore,
		} = this;
		return (
			<Form
				{...other}
				ref={formRef}
				value={value}
				onSubmit={this._handleSubmit}
				onChange={this._handleChange}
			>
				{renderers.map(({ renderForm }, index) => (
					<FormItem renderForm={renderForm} formStore={formStore} key={index} />
				))}
				{footer}
			</Form>
		);
	}
}

function FormBodyWrapper(props) {
	const { store, value } = props;
	if (store.isFetching || value === undefined) return <SpinBox />;
	return <FormBody {...props} />;
}

FormBodyWrapper.propTypes = {
	store: PropTypes.object,
	value: PropTypes.any,
};

export default observer(FormBodyWrapper);
