
import React, { Component, Children, cloneElement } from 'react';
import { Modal } from 'antd';
import { Form } from 'components/Nested';

import PropTypes from 'prop-types';

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
		children: PropTypes.node,
		title: PropTypes.string,
		search: PropTypes.string,
		onSubmit: PropTypes.func.isRequired,
	};

	componentDidUpdate() {
		const { title } = this.props;
		if (title) { this._prevTitle = title; }
	}

	_saveForm = (form) => {
		if (form) { this.form = form; }
	};

	submit() {
		return this.form.form.submit();
	}

	render() {
		const {
			props: {
				children,
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
				<Form ref={this._saveForm} onSubmit={onSubmit}>
					{Children.map(
						children,
						(child) => cloneElement(child, formItemLayout),
					)}
				</Form>
			</Modal>
		);
	}
}

