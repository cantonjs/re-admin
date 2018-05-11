import React, { Component } from 'react';
import { createContext } from 'utils/reactPolyfill';
import hoist, { extractRef } from 'hocs/hoist';

const IssuerContext = createContext(new Set());

const extendIssuers = (issuers, issuer) => {
	const newIssuers = new Set(issuers);
	newIssuers.add(issuer);
	return newIssuers;
};

export default function withIssuer(options = {}) {
	const { issuer } = options;

	return function createIssuerComponent(WrappedComponent) {
		@hoist(WrappedComponent)
		class WithIssuer extends Component {
			static defaultProps = {
				...WrappedComponent.defaultProps,
			};

			_renderProvider(issuers) {
				return (
					<IssuerContext.Provider value={extendIssuers(issuers, issuer)}>
						<WrappedComponent {...extractRef(this.props)} />
					</IssuerContext.Provider>
				);
			}

			_renderConsumer(issuers) {
				return (
					<WrappedComponent {...extractRef(this.props)} issuers={issuers} />
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
		return WithIssuer;
	};
}
