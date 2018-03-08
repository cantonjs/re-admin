
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import hoistReactInstanceMethods from 'hoist-react-instance-methods';

export default function withAppConfig(mapConfig, options = {}) {
	const {
		withRef = false,
		hoistMethods = [],
	} = options;

	return function createWithAppConfigComponent(WrappedComponent) {
		@hoistReactInstanceMethods(
			(instance) => instance.getWrappedInstance(),
			hoistMethods,
		)
		class WithAppConfig extends Component {
			static contextTypes = {
				appConfig: PropTypes.object.isRequired,
			};

			_withRef = withRef ? { ref: (c) => (this.wrappedInstance = c) } : {};

			getWrappedInstance() {
				return this.wrappedInstance;
			}

			render() {
				const { props, context: { appConfig } } = this;
				return (
					<WrappedComponent
						{...mapConfig(appConfig, props)}
						{...props}
						{...this._withRef}
					/>
				);
			}
		}

		return hoistStatics(WithAppConfig, WrappedComponent);
	};
};
