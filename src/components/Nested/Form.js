
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NestedForm from 'react-nested-form';

export default class NForm extends Component {
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

	attach(...args) {
		this.form.attach(...args);
	}

	detach(...args) {
		this.form.detach(...args);
	}

	validate(...args) {
		this.form.validate(...args);
	}

	setAsPristine(...args) {
		this.form.setAsPristine(...args);
	}

	submit(...args) {
		this.form.submit(...args);
	}

	reset(...args) {
		this.form.reset(...args);
	}

	_saveForm = (form) => {
		if (form) { this.form = form; }
	};

	render() {
		const {
			layout, prefixCls, className,

			// eslint-disable-next-line
			labelCol, wrapperCol, render, wrapperStyle, colon,

			...other
		} = this.props;
		const customClassName = className ? ` ${className}` : '';
		return (
			<NestedForm
				ref={this._saveForm}
				className={`${prefixCls}-${layout}` + customClassName}
				{...other}
			/>
		);
	}
}
