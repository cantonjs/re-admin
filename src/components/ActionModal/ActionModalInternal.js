
import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'utils/PropTypes';
import { Modal } from 'antd';
import { Form } from 'components/Nested';

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

export default class ActionModalInternal extends Component {
	static propTypes = {
		form: PropTypes.object,
		formRenderers: PropTypes.array.isRequired,
		title: PropTypes.string,
		search: PropTypes.string,
		onSubmit: PropTypes.func.isRequired,
	};

	static childContextTypes = {
		formState: PropTypes.object,
	};

	componentWillMount() {
		this._formData = {};
	}

	componentDidUpdate() {
		const { title } = this.props;
		if (title) { this._prevTitle = title; }
	}

	_saveForm = (form) => {
		if (form) { this.form = form; }
	};

	_getFormData = () => {
		return this._formData;
	};

	_handleChange = (data) => {
		this._formData = data;
		this.forceUpdate();
	};

	submit() {
		return this.form.form.submit();
	}

	render() {
		const {
			props: {
				formRenderers,
				title,
				onSubmit,
				search,
				...other,
			},
		} = this;

		const children = formRenderers.map(({ render, props, options }) =>
			render(props, { ...options, getFormData: this._getFormData })
		);

		return (
			<Modal
				title={title || this._prevTitle}
				maskClosable={false}
				key={search}
				{...other}
			>
				<Form
					ref={this._saveForm}
					onSubmit={onSubmit}
					onChange={this._handleChange}
				>
					{Children.map(
						children,
						(child) => child && cloneElement(child, formItemLayout),
					)}
				</Form>
			</Modal>
		);
	}
}

