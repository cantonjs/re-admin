import React, { Component } from 'react';
import styles from './styles';
import PropTypes from 'prop-types';
import State from './State';
import { QUERIER } from 'utils/Issuers';
import { observer } from 'mobx-react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import withIssuer from 'hoc/withIssuer';

export default function field(WrappedComponent) {
	@withIssuer()
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
			sortable: PropTypes.bool,

			// provided by `withIssuer()`
			issuers: PropTypes.instanceOf(Set).isRequired,
		};

		static defaultProps = {
			disabled: false,
			sortable: false,
			...WrappedComponent.defaultProps,
		};

		static contextTypes = {
			store: PropTypes.object,
			modalStore: PropTypes.object,
			getParentValue: PropTypes.func,
		};

		componentWillMount() {
			this._state = new State(this.props, this.context);
		}

		getValue = () => {
			return this._state.value;
		};

		render() {
			if (!this._state.shouldShow) {
				return null;
			}

			const {
				props: {
					disabled,
					required,
					issuers,

					value,
					defaultValue,
					unique,
					sortable,

					...other
				},
			} = this;

			const isInQuery = issuers.has(QUERIER);

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

	WithField.WrappedComponent = WrappedComponent;
	return hoistNonReactStatics(WithField, WrappedComponent);
}
