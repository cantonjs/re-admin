import React, { Component } from 'react';
import { createRef } from 'utils/reactPolyfill';
import FormLayoutContext from 'contexts/FormLayout';
import PropTypes from 'prop-types';
import { Form } from 'react-form-mobx';

export default class FormView extends Component {
	static propTypes = {
		prefixCls: PropTypes.string,
		layout: PropTypes.string,
		className: PropTypes.string,
	};

	static defaultProps = {
		prefixCls: 'ant-form',
		layout: 'horizontal',
	};

	static childContextTypes = {
		vertical: PropTypes.bool,
	};

	formRef = createRef();

	getChildContext() {
		const { layout } = this.props;
		return {
			vertical: layout === 'vertical',
		};
	}

	submit(...args) {
		this.formRef.current.submit(...args);
	}

	reset(...args) {
		this.formRef.current.reset(...args);
	}

	clear(...args) {
		this.formRef.current.clear(...args);
	}

	getValidState() {
		return this.formRef.current.getValidState();
	}

	render() {
		const {
			layout,
			prefixCls,
			className,

			/* eslint-disable */
			labelCol,
			wrapperCol,
			render,
			wrapperStyle,
			colon,
			/* eslint-enable */

			...other
		} = this.props;
		const customClassName = className ? ` ${className}` : '';
		return (
			<FormLayoutContext.Provider value={layout}>
				<Form
					ref={this.formRef}
					className={`${prefixCls}-${layout}` + customClassName}
					{...other}
				/>
			</FormLayoutContext.Provider>
		);
	}
}
