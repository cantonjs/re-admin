import React, { Component } from 'react';
import styles from './styles';
import PropTypes from 'prop-types';
import State from './State';
import { QUERIER } from 'utils/Issuers';
import { observer } from 'mobx-react';
import withIssuer from 'hocs/withIssuer';
import withStore from 'hocs/withStore';
import withModalStore from 'hocs/withModalStore';
import hoist, { extractRef } from 'hocs/hoist';

export default function field(WrappedComponent) {
	@hoist(WrappedComponent)
	@withStore()
	@withIssuer()
	@withModalStore()
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
			store: PropTypes.object,

			// provided by `withIssuer()`
			issuers: PropTypes.instanceOf(Set).isRequired,

			// provided by `withIssuer()`
			modalStore: PropTypes.object.isRequired,
		};

		static defaultProps = {
			disabled: false,
			sortable: false,
			...WrappedComponent.defaultProps,
		};

		static contextTypes = {
			getParentValue: PropTypes.func,
		};

		constructor(props, context) {
			super(props, context);
			console.log('props', props.store);

			this._state = new State(props, context);
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
					modalStore,

					...other
				},
			} = this;

			const isInQuery = issuers.has(QUERIER);

			return (
				<WrappedComponent
					wrapperStyle={styles.container}
					{...extractRef(other)}
					required={required && !isInQuery}
					disabled={disabled && !isInQuery}
					getValue={this.getValue}
				/>
			);
		}
	}

	return WithField;
}
