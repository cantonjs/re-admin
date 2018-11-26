import React, { Component } from 'react';
import { polyfill } from 'react-lifecycles-compat';
import hoist, { extractRef } from 'hocs/hoist';
import ModalStoreContext from './ModalStoreContext';

export default function withModalStore(options = {}) {
	const { prop = 'modalStore' } = options;
	return function createModalStoreComponent(WrappedComponent) {
		@hoist(WrappedComponent)
		@polyfill
		class WithModalStore extends Component {
			static defaultProps = {
				...WrappedComponent.defaultProps,
			};

			render() {
				return (
					<ModalStoreContext.Consumer>
						{(modalStore) => {
							const modalStoreProp = { [prop]: modalStore };
							return (
								<WrappedComponent
									{...extractRef(this.props)}
									{...modalStoreProp}
								/>
							);
						}}
					</ModalStoreContext.Consumer>
				);
			}
		}
		return WithModalStore;
	};
}
