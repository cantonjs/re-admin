import PropTypes from 'prop-types';
import React, { cloneElement } from 'react';
import { observer } from 'mobx-react';
import FormLayoutContext from 'contexts/FormLayout';

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
	if (!children) return null;
	return (
		<FormLayoutContext.Consumer>
			{(layout) =>
				layout === 'horizontal' ?
					cloneElement(children, formItemLayout) :
					children
			}
		</FormLayoutContext.Consumer>
	);
};

FormItem.propTypes = {
	renderForm: PropTypes.func.isRequired,
	formStore: PropTypes.object.isRequired,
};

export default observer(FormItem);
