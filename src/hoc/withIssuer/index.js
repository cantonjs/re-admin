import React, { Component } from 'react';
import createReactContext from 'create-react-context';
import hoistStatics from 'hoist-non-react-statics';
import hoistReactInstanceMethods from 'hoist-react-instance-methods';

const IssuerContext = createReactContext(new Set());

const extendIssuers = (issuers, issuer) => {
	const newIssuers = new Set(issuers);
	newIssuers.add(issuer);
	return newIssuers;
};

export default function withIssuer(options = {}) {
	const { issuer, withRef = false, hoistMethods = [] } = options;

	return function createIssuerComponent(WrappedComponent) {
		@hoistReactInstanceMethods(
			(instance) => instance.getWrappedInstance(),
			hoistMethods
		)
		class WithIssuer extends Component {
			static defaultProps = {
				...WrappedComponent.defaultProps,
			};

			_withRef = withRef ? { ref: (c) => (this.wrappedInstance = c) } : {};

			getWrappedInstance() {
				return this.wrappedInstance;
			}

			_renderProvider(issuers) {
				return (
					<IssuerContext.Provider value={extendIssuers(issuers, issuer)}>
						<WrappedComponent {...this.props} {...this._withRef} />
					</IssuerContext.Provider>
				);
			}

			_renderConsumer(issuers) {
				return (
					<WrappedComponent
						{...this.props}
						{...this._withRef}
						issuers={issuers}
					/>
				);
			}

			render() {
				return (
					<IssuerContext.Consumer>
						{(issuers) =>
							issuer ?
								this._renderProvider(issuers) :
								this._renderConsumer(issuers)
						}
					</IssuerContext.Consumer>
				);
			}
		}

		WithIssuer.WrappedComponent = WrappedComponent;
		WithIssuer.WrappedComponent = WrappedComponent;
		return hoistStatics(WithIssuer, WrappedComponent);
	};
}
