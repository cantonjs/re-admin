import React, { Component } from 'react';
import hoist, { extractRef } from 'hoc/hoist';
import ModalStoreContext from './ModalStoreContext';

export default function withModalStore() {
	return function createModalStoreComponent(WrappedComponent) {
		@hoist(WrappedComponent)
		class WithModalStore extends Component {
			static defaultProps = {
				...WrappedComponent.defaultProps,
			};

			render() {
				return (
					<ModalStoreContext.Consumer>
						{(modalStore) => (
							<WrappedComponent
								{...extractRef(this.props)}
								modalStore={modalStore}
							/>
						)}
					</ModalStoreContext.Consumer>
				);
			}
		}
		return WithModalStore;
	};
}
