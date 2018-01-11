
import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'utils/PropTypes';
import withField from 'utils/withField';
import { Form } from 'components/Nested';
import { Form as AntdForm } from 'antd';

const { Item } = AntdForm;

const formItemLayout = {
	labelCol: { span: 14 },
	wrapperCol: { span: 14 },
};

@withField
export default class ObjectOf extends Component {
	static propTypes = {
		name: PropTypes.string,
		children: PropTypes.node,
		getValue: PropTypes.func.isRequired,
		required: PropTypes.bool,
		label: PropTypes.node,
		labelCol: PropTypes.object,
		wrapperCol: PropTypes.object,
		colon: PropTypes.bool,
		wrapperStyle: PropTypes.object,
	};

	static childContextTypes = {
		getParentValue: PropTypes.func,
	};

	static renderTable(props, { text = {} }) {
		return JSON.stringify(text);
	}

	getChildContext() {
		return {
			getParentValue: () => this.props.getValue(),
		};
	}

	render() {
		const {
			getValue, children,
			label, labelCol, wrapperCol, colon, required, wrapperStyle,

			...other
		} = this.props;

		return (
			<Item
				label={label}
				labelCol={labelCol}
				wrapperCol={wrapperCol}
				colon={colon}
				required={required}
				// validateStatus={isValid ? 'error' : 'success'}
				// help={errorMessage}
				style={wrapperStyle}
			>
				<Form layout="vertical" {...other}>
					{Children.map(
						children,
						(child) => cloneElement(child, formItemLayout),
					)}
				</Form>
			</Item>
		);
	}
}
