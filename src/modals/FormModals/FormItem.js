import PropTypes from 'prop-types';
import { cloneElement } from 'react';
import { observer } from 'mobx-react';

const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 6 },
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 18 },
	},
};

const FormItem = function FormItem({ renderForm, formStore }) {
	const children = renderForm(formStore);
	return children ? cloneElement(children, formItemLayout) : null;
};

FormItem.propTypes = {
	renderForm: PropTypes.func.isRequired,
	formStore: PropTypes.object.isRequired,
};

export default observer(FormItem);
