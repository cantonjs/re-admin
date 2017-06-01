
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { returnsArgument } from 'empty-functions';
import { UPDATER, QUERIER } from 'constants/Issuers';
import { Form } from 'antd';
import { omit } from 'lodash';

const FormItem = Form.Item;

const styles = {
	container: {
		marginBottom: 12,
	},
};

export default function withField(WrappedComponent) {
	@withRouter
	class WithField extends Component {
		static propTypes = {
			name: PropTypes.string.isRequired,
			location: PropTypes.shape({
				query: PropTypes.object.isRequired,
			}).isRequired,
			params: PropTypes.any.isRequired,
			router: PropTypes.any.isRequired,
			routes: PropTypes.any.isRequired,
			label: PropTypes.string.isRequired,
			labelCol: PropTypes.object,
			wrapperCol: PropTypes.object,
			shouldHideInForm: PropTypes.bool,
			shouldHideInTable: PropTypes.bool,
			shouldShowInQuery: PropTypes.bool,
			dataType: PropTypes.func,
			unique: PropTypes.bool,
			disabled: PropTypes.bool,
			validator: PropTypes.array,
			render: PropTypes.func,
		};

		static defaultProps = {
			validator: [],
		};

		static contextTypes = {
			form: PropTypes.object,
			store: PropTypes.object,
			issuer: PropTypes.string,
		};

		componentWillMount() {
			const {
				props: { validator },
				context: { issuer },
			} = this;

			if (issuer !== QUERIER) {
				this._validator = validator;
			}
			else {
				this._validator = validator.map((options) =>
					omit(options, ['required'])
				);
			}

			this._shouldShow = this._detectShouldShow();
		}

		_detectShouldShow() {
			const {
				props: {
					name,
					location: { query: { _names } },
					shouldShowInQuery,
					shouldHideInForm,
				},
				context: {
					issuer,
				},
			} = this;

			const isInQuery = issuer === QUERIER;

			if (
				(!isInQuery && shouldHideInForm) ||
				(isInQuery && !shouldShowInQuery)
			) {
				return null;
			}

			const isUpdater = issuer === UPDATER;

			if (isUpdater && _names) {
				const names = _names.split(',');
				if (names.length && names.indexOf(name) < 0) { return null; }
			}

			return true;
		}

		getValue = () => {
			const {
				props: { name, location: { query } },
				context: { store, issuer },
			} = this;

			const selectedKeys = (query._keys || '').split(',');

			if (issuer === QUERIER) {
				return query[name] || '';
			}

			else if (selectedKeys.length === 1 && issuer === UPDATER) {
				const item = store.findItemByKey(selectedKeys[0]);
				return item ? item[name] : '';
			}

			return '';
		};

		getFieldDecorator = (options) => {
			const {
				props: { name, disabled },
				context: { form: { getFieldDecorator }, issuer },
			} = this;
			const isInQuery = issuer === QUERIER;
			const isDisabled = disabled && !isInQuery;
			return isDisabled ? returnsArgument : getFieldDecorator(name, options);
		};

		render() {
			if (!this._shouldShow) { return null; }

			const {
				props: {
					label,
					labelCol,
					wrapperCol,
					disabled,

					name,
					location,
					params,
					router,
					routes,
					dataType,
					unique,
					render,
					validator,
					shouldHideInForm,
					shouldShowInQuery,
					shouldHideInTable,

					...other,
				},
				context: {
					issuer,
				},
			} = this;

			const isInQuery = issuer === QUERIER;

			// if (
			// 	(!isInQuery && shouldHideInForm) ||
			// 	(isInQuery && !shouldShowInQuery)
			// ) {
			// 	return null;
			// }

			// const isUpdater = issuer === UPDATER;

			// if (isUpdater && _names) {
			// 	const names = _names.split(',');
			// 	if (names.length && names.indexOf(name) < 0) { return null; }
			// }

			return (
				<FormItem
					label={label}
					labelCol={labelCol}
					wrapperCol={wrapperCol}
					style={styles.container}
				>
					<WrappedComponent
						{...other}
						disabled={disabled && !isInQuery}
						getValue={this.getValue}
						validator={this._validator}
						getFieldDecorator={this.getFieldDecorator}
					/>
				</FormItem>
			);
		}
	}

	function BasicField(props) {
		return (
			<WithField {...props} />
		);
	}

	BasicField.defaultProps = {
		labelCol: { span: 8 },
		wrapperCol: { span: 16 },
		shouldHideInForm: false,
		shouldHideInTable: false,
		disabled: false,
		...WrappedComponent.defaultProps,
	};

	return BasicField;
}
