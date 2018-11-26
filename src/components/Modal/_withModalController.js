import React, { Component } from 'react';
import hoist, { extractRef } from 'hocs/hoist';
import ModalControllerContext from './ModalControllerContext';

export default function withModalController(options = {}) {
	const { prop = 'modalController' } = options;
	return function createModalControllerComponent(WrappedComponent) {
		@hoist(WrappedComponent)
		class WithModalController extends Component {
			static defaultProps = {
				...WrappedComponent.defaultProps,
			};

			render() {
				return (
					<ModalControllerContext.Consumer>
						{(modalController) => {
							const modalControllerProp = { [prop]: modalController };
							return (
								<WrappedComponent
									{...extractRef(this.props)}
									{...modalControllerProp}
								/>
							);
						}}
					</ModalControllerContext.Consumer>
				);
			}
		}
		return WithModalController;
	};
}
