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

const FormItem = function FormItem({ render, formState }) {
	const children = render('renderForm', {
		getData: () => (formState ? formState.data : {}),
	});
	return children ? cloneElement(children, formItemLayout) : null;
};

FormItem.propTypes = {
	render: PropTypes.func.isRequired,
	formState: PropTypes.object.isRequired,
};

export default observer(FormItem);
