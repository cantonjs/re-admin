import React, { Component } from 'react';
import hoist, { extractRef } from 'hocs/hoist';
import ModalPropsContext from './ModalPropsContext';

export default function withModalProps(options = {}) {
	const { prop = 'modalProps' } = options;
	return function createModalPropsComponent(WrappedComponent) {
		@hoist(WrappedComponent)
		class WithModalProps extends Component {
			static defaultProps = {
				...WrappedComponent.defaultProps,
			};

			render() {
				return (
					<ModalPropsContext.Consumer>
						{(modalProps) => {
							const extraProps = { [prop]: modalProps };
							return (
								<WrappedComponent {...extractRef(this.props)} {...extraProps} />
							);
						}}
					</ModalPropsContext.Consumer>
				);
			}
		}
		return WithModalProps;
	};
}
