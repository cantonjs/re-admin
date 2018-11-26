import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import ModalControllerContext from './ModalControllerContext';
import Nonconductor from 'components/Nonconductor';
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

	state = {
		parent: this.props.modalController,
		state: {},
		name: '',
		visible: false,
		open: (name, state) => {
			if (name && this.state.name !== name) {
				this.setState({
					visible: true,
					name,
					state,
				});
			}
		},
		close: () => {
			if (this.state.visible) {
				this.setState({
					visible: false,
					name: '',
					state: {},
				});
			}
		},
	};

	render() {
		const { component: Wrap, children, modalController, ...other } = this.props;
		return (
			<ModalControllerContext.Provider value={this.state}>
				<Wrap {...other}>
					{children}
					<Nonconductor component={ModalPortal} />
				</Wrap>
			</ModalControllerContext.Provider>
		);
	}
}
