import styles from './styles';
import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'utils/PropTypes';
import field from 'hocs/field';
import { ObjectOf as FormObjectOf } from 'react-form-mobx';
import { Form as AntdForm } from 'antd';
import { createRef } from 'utils/reactPolyfill';

const { Item } = AntdForm;

const formItemLayout = {
	labelCol: { span: 14 },
	wrapperCol: { span: 14 },
};

@field
export default class ObjectOf extends Component {
	static propTypes = {
		name: PropTypes.string,
		children: PropTypes.node,
		required: PropTypes.bool,
		label: PropTypes.node,
		labelCol: PropTypes.object,
		wrapperCol: PropTypes.object,
		colon: PropTypes.bool,
		wrapperStyle: PropTypes.object,
		prefixCls: PropTypes.string,
	};

	static defaultProps = {
		prefixCls: 'ant-form',
	};

	static childContextTypes = {
		vertical: PropTypes.bool,
		getParentValue: PropTypes.func,
	};

	static renderTable(props, { text = {} }) {
		return JSON.stringify(text);
	}

	objRef = createRef();

	getChildContext() {
		return {
			vertical: true,

			// TODO:
			getParentValue: () => this.objRef.current.getValue(),
		};
	}

	render() {
		const {
			children,
			label,
			labelCol,
			wrapperCol,
			colon,
			required,
			wrapperStyle,
			prefixCls,

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
				<FormObjectOf {...other} ref={this.objRef}>
					<div className={`${prefixCls}-vertical`} style={styles.main}>
						{Children.map(children, (child) =>
							cloneElement(child, formItemLayout)
						)}
					</div>
				</FormObjectOf>
			</Item>
		);
	}
}
