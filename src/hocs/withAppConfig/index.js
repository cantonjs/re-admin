import PropTypes from 'prop-types';
import React, { Component } from 'react';
import hoist, { extractRef } from 'hocs/hoist';

export default function withAppConfig(mapConfig) {
	return function createWithAppConfigComponent(WrappedComponent) {
		@hoist(WrappedComponent)
		class WithAppConfig extends Component {
			static contextTypes = {
				appConfig: PropTypes.object.isRequired,
			};

			render() {
				const { props, context: { appConfig } } = this;
				return (
					<WrappedComponent
						{...mapConfig(appConfig, props)}
						{...extractRef(props)}
					/>
				);
			}
		}
		return WithAppConfig;
	};
}
