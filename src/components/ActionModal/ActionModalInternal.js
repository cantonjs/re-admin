
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
		if (this.props.title) {
			this._prevTitle = this.props.title;
		}
	}

	render() {
		const {
			props: {
				children,
				title,
				onSubmit,
				...other,
			},
		} = this;

		return (
			<Modal
				title={title || this._prevTitle}
				maskClosable={false}
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

