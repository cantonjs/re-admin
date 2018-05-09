import React, { Component } from 'react';
import hoist, { extractRef } from 'hocs/hoist';
import ModalStore from 'stores/ModalStore';
import ModalStoreContext from './ModalStoreContext';

export default function withModalStoreProvider() {
	return function createModalStoreProviderComponent(WrappedComponent) {
		@hoist(WrappedComponent)
		class WithModalStoreProvider extends Component {
			static defaultProps = {
				...WrappedComponent.defaultProps,
			};

			modalStore = new ModalStore();

			render() {
				const { modalStore } = this;
				return (
					<ModalStoreContext.Provider value={modalStore}>
						<WrappedComponent
							{...extractRef(this.props)}
							modalStore={modalStore}
						/>
					</ModalStoreContext.Provider>
				);
			}
		}
		return WithModalStoreProvider;
	};
}
