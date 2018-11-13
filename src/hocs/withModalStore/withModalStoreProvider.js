import PropTypes from 'prop-types';
import React, { Component } from 'react';
import hoist, { extractRef } from 'hocs/hoist';
import ModalStore from 'stores/ModalStore';
import ModalStoreContext from './ModalStoreContext';

export default function withModalStoreProvider() {
	return function createModalStoreProviderComponent(WrappedComponent) {
		@hoist(WrappedComponent)
		class WithModalStoreProvider extends Component {
			static propTypes = {
				modalStore: PropTypes.object,
			};

			constructor(props) {
				super(props);

				const { modalStore } = props;
				this.modalStore = new ModalStore(modalStore);
			}

			render() {
				const { modalStore, props } = this;
				const { modalStore: _, ...other } = props;
				return (
					<ModalStoreContext.Provider value={modalStore}>
						<WrappedComponent {...extractRef(other)} modalStore={modalStore} />
					</ModalStoreContext.Provider>
				);
			}
		}
		return WithModalStoreProvider;
	};
}
