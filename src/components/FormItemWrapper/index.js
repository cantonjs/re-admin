
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
export default class FormItemWrapper extends Component {
	static propTypes = {
		renderOptions: PropTypes.object,
		withLayout: PropTypes.bool,
	};

	static defaultProps = {
		withLayout: false,
	};

	static contextTypes = {
		formState: PropTypes.object,
	};

	render() {
		const {
			withLayout,
			renderOptions: { render, props, options },
		} = this.props;
		const children = render(props, {
			...options,
			getData: () => {
				const { formState } = this.context;
				return formState ? formState.data : {};
			},
		});
		if (withLayout) {
			return children ? cloneElement(children, formItemLayout) : null;
		}
		return children;
	}
}
