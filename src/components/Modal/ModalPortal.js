import React, { Component } from 'react';
import { observer, Observer } from 'mobx-react';
import ModalPropsStore from './ModalPropsStore';
import { Modal } from 'antd';
import ModalControllerContext from './ModalControllerContext';
import ModalPropsContext from './ModalPropsContext';
import ModalBody from './ModalBody';

@observer
export default class ModalPortal extends Component {
	store = new ModalPropsStore();

	_close() {
		this.modalController.close();
	}

	_handleOk = (ev) => {
		const { props } = this.store;
		if (props.onOk) props.onOk(ev);
		ev.isDefaultPrevented() || this._close();
	};

	_handleCancel = (ev) => {
		const { props } = this.store;
		if (props.onCancel) props.onCancel(ev);
		ev.isDefaultPrevented() || this._close();
	};

	render() {
		const { props } = this.store;
		return (
			<ModalPropsContext.Provider value={this.store}>
				<ModalControllerContext.Consumer>
					{(modalController) => (
						<Observer>
							{() => {
								const { visible } = modalController;
								this.modalController = modalController;
								return (
									<Modal
										maskClosable={false}
										{...props}
										visible={visible}
										onOk={this._handleOk}
										onCancel={this._handleCancel}
									>
										{visible && <ModalBody />}
									</Modal>
								);
							}}
						</Observer>
					)}
				</ModalControllerContext.Consumer>
			</ModalPropsContext.Provider>
		);
	}
}
