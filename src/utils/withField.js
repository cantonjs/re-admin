
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { returnsArgument } from 'empty-functions';
import { UPDATER, QUERIER } from 'constants/Issuers';
import { Form } from 'antd';

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
		};

		static contextTypes = {
			form: PropTypes.object,
			store: PropTypes.object,
			issuer: PropTypes.string,
		};

		getValue = () => {
			const {
				props: { name, location: { query } },
				context: { store: { selection }, issuer },
			} = this;

			if (issuer === QUERIER) {
				return query[name];
			}
			else if (selection.length === 1 && issuer === UPDATER) {
				return selection[0][name];
			}
			return '';
		};

		getFieldDecorator = (options) => {
			const {
				props: { name, disabled },
				context: { form: { getFieldDecorator }, issuer },
			} = this;
			const isDisabled = disabled && issuer !== QUERIER;
			return isDisabled ? returnsArgument : getFieldDecorator(name, options);
		};

		render() {
			const {
				props: {
					label,
					labelCol,
					wrapperCol,
					shouldHideInForm,

					disabled,
					shouldShowInQuery,

					name,
					location,
					params,
					router,
					routes,
					dataType,
					unique,
					render,
					shouldHideInTable,

					...other,
				},
				context: {
					issuer,
				},
			} = this;

			if (shouldHideInForm) { return null; }

			return (
				<FormItem
					label={label}
					labelCol={labelCol}
					wrapperCol={wrapperCol}
					style={styles.container}
				>
					<WrappedComponent
						{...other}
						disabled={disabled && issuer !== QUERIER}
						getValue={this.getValue}
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
