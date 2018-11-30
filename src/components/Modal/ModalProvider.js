import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import ModalControllerStore from './ModalControllerStore';
import ModalControllerContext from './ModalControllerContext';
import ModalPortal from './ModalPortal';

export default class ModalProvider extends Component {
	static propTypes = {
		modalController: PropTypes.object,
		children: PropTypes.node,
		component: PropTypes.component,
	};

	static defaultProps = {
		component: 'div',
	};

	modalController = new ModalControllerStore(this.props.modalController);

	render() {
		const { component: Wrap, children, modalController, ...other } = this.props;
		return (
			<ModalControllerContext.Provider value={this.modalController}>
				<Wrap {...other}>
					{children}
					<ModalPortal />
				</Wrap>
			</ModalControllerContext.Provider>
		);
	}
}
