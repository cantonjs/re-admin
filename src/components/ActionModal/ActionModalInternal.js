
import React, { Component, Children, cloneElement } from 'react';
import { Form, Modal } from 'antd';
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

@Form.create()
export default class ActionModalInternal extends Component {
	static propTypes = {
		form: PropTypes.object,
		children: PropTypes.node,
		title: PropTypes.string,
		search: PropTypes.string,
		onSubmit: PropTypes.func.isRequired,
	};

	static childContextTypes = {
		form: PropTypes.object,
	};

	getChildContext() {
		const { form } = this.props;
		return { form };
	}

	componentDidUpdate() {
		const { title } = this.props;
		if (title) { this._prevTitle = title; }
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
				<Form onSubmit={onSubmit}>
					{Children.map(
						children,
						(child) => cloneElement(child, formItemLayout),
					)}
				</Form>
			</Modal>
		);
	}
}

