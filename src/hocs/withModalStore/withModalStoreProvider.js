import PropTypes from 'prop-types';
import React, { Component } from 'react';
import hoist, { extractRef } from 'hocs/hoist';
import routerStore from 'stores/routerStore';
import ModalStore from 'stores/ModalStore';
import ModalStoreContext from './ModalStoreContext';
import withModalStore from './withModalStore';

export default function withModalStoreProvider() {
	return function createModalStoreProviderComponent(WrappedComponent) {
		@hoist(WrappedComponent)
		@withModalStore({ prop: 'parentModalStore' })
		class WithModalStoreProvider extends Component {
			static propTypes = {
				parentModalStore: PropTypes.object,
				modalStore: PropTypes.object,
			};

			constructor(props) {
				super(props);

				const { parentModalStore, modalStore } = props;
				this.modalStore = new ModalStore(
					modalStore,
					parentModalStore && routerStore
				);
			}

			componentWillUnmount() {
				this.modalStore.destroy();
			}

			render() {
				const { modalStore, props } = this;
				const { modalStore: _, parentModalStore, ...other } = props;
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
