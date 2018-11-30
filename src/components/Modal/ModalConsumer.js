import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ModalControllerContext from './ModalControllerContext';
import ModalPropsContext from './ModalPropsContext';
import withIssuer from 'hocs/withIssuer';
import { MODAL } from 'utils/Issuers';
import ModalProvider from './ModalProvider';
import ModalPropsUpdater from './ModalPropsUpdater';

@withIssuer({ issuer: MODAL })
export default class ModalConsumer extends Component {
	static propTypes = {
		children: PropTypes.node,
	};

	close = () => {
		this.modalController.close();
	};

	render() {
		const { children, ...restProps } = this.props;
		return (
			<ModalControllerContext.Consumer>
				{(modalController) => (
					<ModalPropsContext.Consumer>
						{(modalProps) => {
							this.modalController = modalController;
							return (
								<ModalProvider modalController={modalController}>
									{children}
									<ModalPropsUpdater {...restProps} modalProps={modalProps} />
								</ModalProvider>
							);
						}}
					</ModalPropsContext.Consumer>
				)}
			</ModalControllerContext.Consumer>
		);
	}
}
