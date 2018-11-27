import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import ModalControllerContext from './ModalControllerContext';
import ModalPropsContext from './ModalPropsContext';
import withIssuer from 'hocs/withIssuer';
import { MODAL } from 'utils/Issuers';
import ModalProvider from './ModalProvider';

@withIssuer({ issuer: MODAL })
@observer
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
							modalProps.set(restProps);
							return (
								<ModalProvider modalController={modalController}>
									{children}
								</ModalProvider>
							);
						}}
					</ModalPropsContext.Consumer>
				)}
			</ModalControllerContext.Consumer>
		);
	}
}
