
import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'utils/PropTypes';
import { observable, computed } from 'mobx';
import { Modal } from 'antd';
import { Form } from 'components/Nested';
import FormItemWrapper from 'components/FormItemWrapper';

class FormState {
	@observable data = {};
}

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

	getChildContext() {
		return { formState: this._formState };
	}

	componentWillMount() {
		this._formState = new FormState();
	}

	componentDidUpdate() {
		const { title } = this.props;
		if (title) { this._prevTitle = title; }
	}

	_saveForm = (form) => {
		if (form) { this.form = form; }
	};

	_handleChange = (data) => {
		this._formState.data = data;
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
					{formRenderers.map((renderOptions, index) =>
						<FormItemWrapper renderOptions={renderOptions} key={index} />
					)}
				</Form>
			</Modal>
		);
	}
}

