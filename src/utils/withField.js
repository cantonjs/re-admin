
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { UPDATER, QUERIER } from 'constants/Issuers';
import routerStore from 'stores/routerStore';
import { observer } from 'mobx-react';
import { isUndefined } from 'lodash';
import hoistNonReactStatics from 'hoist-non-react-statics';

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
			required: PropTypes.bool,
			unique: PropTypes.bool,
			disabled: PropTypes.bool,
			validations: PropTypes.array,
		};

		static defaultProps = {
			disabled: false,
			...WrappedComponent.defaultProps,
		};

		static contextTypes = {
			store: PropTypes.object,
			issuer: PropTypes.string,
			getParentValue: PropTypes.func,
		};

		getValue = () => {
			const {
				props: { name, value },
				context: { store, issuer, getParentValue },
			} = this;

			if (!isUndefined(value) || !name) { return value; }

			const { query } = routerStore.location;
			const selectedKeys = (query._keys || '').split(',');

			if (issuer === QUERIER) {
				return query[name];
			}

			else if (selectedKeys.length === 1 && issuer === UPDATER) {
				const item = getParentValue ?
					getParentValue() : store.findItemByKey(selectedKeys[0])
				;
				return item ? item[name] : undefined;
			}

			return '';
		};

		render() {
			const {
				props: {
					disabled,
					required,

					value,
					defaultValue,
					unique,

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

	return hoistNonReactStatics(WithField, WrappedComponent);
}
