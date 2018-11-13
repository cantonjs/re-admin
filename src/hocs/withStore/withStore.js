import React, { Component } from 'react';
import hoist, { extractRef } from 'hocs/hoist';
import StoreContext from 'contexts/Store';

export default function withStore(options = {}) {
	const { prop = 'store' } = options;
	return function createStoreComponent(WrappedComponent) {
		@hoist(WrappedComponent)
		class WithStore extends Component {
			render() {
				const { props } = this;
				return (
					<StoreContext.Consumer>
						{(store) => {
							const storeProps = { [prop]: store };
							return (
								<WrappedComponent {...extractRef(props)} {...storeProps} />
							);
						}}
					</StoreContext.Consumer>
				);
			}
		}
		return WithStore;
	};
}
