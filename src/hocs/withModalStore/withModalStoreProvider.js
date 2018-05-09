import PropTypes from 'prop-types';
import React, { Component } from 'react';
import hoist, { extractRef } from 'hocs/hoist';
import routerStore from 'stores/routerStore';
import ModalStore from 'stores/ModalStore';
import ModalStoreContext from './ModalStoreContext';

export default function withModalStoreProvider() {
	return function createModalStoreProviderComponent(WrappedComponent) {
		@hoist(WrappedComponent)
		class WithModalStoreProvider extends Component {
			static propTypes = {
				modalStore: PropTypes.object,
				syncLocation: PropTypes.bool,
			};

			static defaultProps = {
				...WrappedComponent.defaultProps,
				syncLocation: false,
			};

			modalStore = new ModalStore(
				this.props.modalStore,
				this.props.syncLocation && routerStore
			);

			render() {
				const { modalStore, props } = this;
				const { modalStore: _, syncLocation, ...other } = props;
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
