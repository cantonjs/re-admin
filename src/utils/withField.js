
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { UPDATER, QUERIER } from 'constants/Issuers';
import router from 'stores/router';
import { observer } from 'mobx-react';
import { isUndefined } from 'lodash';
import { parseDataType, dataTypes } from './dataType';

const styles = {
	container: {
		marginBottom: 12,
	},
};

export default function withField(WrappedComponent) {

	@observer
	class WithField extends Component {
		static propTypes = {
			name: PropTypes.string,
			value: PropTypes.any,
			defaultValue: PropTypes.any,
			label: PropTypes.string,
			labelCol: PropTypes.object,
			wrapperCol: PropTypes.object,
			shouldHideInForm: PropTypes.bool,
			shouldHideInTable: PropTypes.bool,
			shouldShowInQuery: PropTypes.bool,
			required: PropTypes.bool,
			dataType: PropTypes.oneOfType([
				PropTypes.func,
				PropTypes.oneOf(dataTypes),
			]),
			unique: PropTypes.bool,
			disabled: PropTypes.bool,
			validations: PropTypes.array,
			render: PropTypes.func,
		};

		static defaultProps = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
			shouldHideInForm: false,
			shouldHideInTable: false,
			disabled: false,
			dataType: 'string',
			...WrappedComponent.defaultProps,
		};

		static contextTypes = {
			store: PropTypes.object,
			issuer: PropTypes.string,
			getParentValue: PropTypes.func,
		};

		componentWillMount() {
			this._shouldShow = this._detectShouldShow();
		}

		_detectShouldShow() {
			const { _names } = router.location.query;
			const {
				props: {
					name,
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

		_getValueBaseOnIssuer() {
			const {
				props: { name, value },
				context: { store, issuer, getParentValue },
			} = this;

			if (!isUndefined(value)) { return value; }
			if (!name) { return ''; }

			const { query } = router.location;
			const selectedKeys = (query._keys || '').split(',');

			if (issuer === QUERIER) {
				return query[name] || '';
			}

			else if (selectedKeys.length === 1 && issuer === UPDATER) {
				const item = getParentValue ?
					getParentValue() : store.findItemByKey(selectedKeys[0])
				;
				return item ? item[name] : '';
			}

			return '';
		}

		getValue = () => {
			return parseDataType(
				this._getValueBaseOnIssuer(),
				this.props.dataType,
			);
		};

		render() {
			if (!this._shouldShow) { return null; }

			const {
				props: {
					disabled,
					required,
					value,
					defaultValue,
					dataType,

					unique,
					render,
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

			return (
				<WrappedComponent
					wrapperStyle={styles.container}
					{...other}
					required={required && !isInQuery}
					disabled={disabled && !isInQuery}
					getValue={this.getValue}
				/>
			);
		}
	}

	return WithField;
}
