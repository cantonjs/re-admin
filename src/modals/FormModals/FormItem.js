import PropTypes from 'prop-types';
import { Component, cloneElement } from 'react';
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

@observer
export default class FormItem extends Component {
	static propTypes = {
		renderOptions: PropTypes.object,
	};

	static contextTypes = {
		formState: PropTypes.object,
	};

	render() {
		const { renderOptions: { render, options } } = this.props;
		const children = render('renderForm', {
			...options,
			getData: () => {
				const { formState } = this.context;
				return formState ? formState.data : {};
			},
		});
		return children ? cloneElement(children, formItemLayout) : null;
	}
}
