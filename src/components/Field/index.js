
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import { withRouter } from 'react-router';
import { returnsArgument } from 'empty-functions';
import { UPDATER, QUERIER } from 'constants/Issuers';

const FormItem = Form.Item;

@withRouter
export default class Field extends Component {
	static propTypes = {
		component: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.func,
		]),
		label: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		location: PropTypes.shape({
			query: PropTypes.object.isRequired,
		}).isRequired,
		params: PropTypes.any.isRequired,
		router: PropTypes.any.isRequired,
		routes: PropTypes.any.isRequired,
		labelCol: PropTypes.object,
		wrapperCol: PropTypes.object,
		dataType: PropTypes.func,
		unique: PropTypes.bool,
		validator: PropTypes.array,
		shouldHideInTable: PropTypes.bool,
		shouldHideInForm: PropTypes.bool,
		noFieldDecorator: PropTypes.bool,
	};

	static defaultProps = {
		component: Input,
		labelCol: { span: 8 },
		wrapperCol: { span: 16 },
		shouldHideInTable: false,
		shouldHideInForm: false,
		noFieldDecorator: false,
	};

	static contextTypes = {
		form: PropTypes.object,
		store: PropTypes.object,
		issuer: PropTypes.string,
	};

	_getValue(name) {
		const {
			props: { location: { query } },
			context: { store: { selection }, issuer },
		} = this;

		if (issuer === QUERIER) {
			return query[name];
		}
		else if (selection.length === 1 && issuer === UPDATER) {
			return selection[0][name];
		}
		return '';
	}

	render() {
		const {
			props: {
				component: Comp,
				label,
				name,
				labelCol,
				wrapperCol,
				shouldHideInForm,
				noFieldDecorator,

				location,
				params,
				router,
				routes,
				dataType,
				unique,
				validator,
				shouldHideInTable,

				...other,
			},
			context: { form },
		} = this;

		if (shouldHideInForm) { return null; }

		const decoratorFn = !noFieldDecorator && form && form.getFieldDecorator;
		const decorator = decoratorFn ?
			decoratorFn(name, { initialValue: this._getValue(name) }) :
			returnsArgument
		;

		return (
			<FormItem
				label={label}
				labelCol={labelCol}
				wrapperCol={wrapperCol}
			>
				{decorator(
					<Comp {...other} />
				)}
			</FormItem>
		);
	}
}
