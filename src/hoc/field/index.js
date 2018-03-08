import React, { Component } from 'react';
import styles from './styles';
import PropTypes from 'prop-types';
import State from './State';
import { QUERIER } from 'constants/Issuers';
import { observer } from 'mobx-react';
import hoistNonReactStatics from 'hoist-non-react-statics';

export default function field(WrappedComponent) {
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
		};

		static defaultProps = {
			disabled: false,
			sortable: false,
			...WrappedComponent.defaultProps,
		};

		static contextTypes = {
			store: PropTypes.object,
			modalStore: PropTypes.object,
			issuer: PropTypes.instanceOf(Set),
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

					value,
					defaultValue,
					unique,
					sortable,

					...other
				},
				context: { issuer },
			} = this;

			const isInQuery = issuer && issuer.has(QUERIER);

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
