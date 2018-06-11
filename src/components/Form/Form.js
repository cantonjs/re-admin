import React, { Component } from 'react';
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

	getChildContext() {
		const { layout } = this.props;
		return {
			vertical: layout === 'vertical',
		};
	}

	submit(...args) {
		this.form.submit(...args);
	}

	reset(...args) {
		this.form.reset(...args);
	}

	clear(...args) {
		this.form.clear(...args);
	}

	_saveForm = (form) => (this.form = form);

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
			<Form
				ref={this._saveForm}
				className={`${prefixCls}-${layout}` + customClassName}
				{...other}
			/>
		);
	}
}
