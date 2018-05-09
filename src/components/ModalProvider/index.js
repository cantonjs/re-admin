import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import { observer } from 'mobx-react';
import routerStore from 'stores/routerStore';
import { withModalStoreProvider } from 'hocs/withModalStore';
import { Modal } from 'antd';
import withIssuer from 'hocs/withIssuer';
import { MODAL } from 'utils/Issuers';

@withIssuer({ issuer: MODAL })
@withModalStoreProvider()
@observer
export default class ModalProvider extends Component {
	static propTypes = {
		modalStore: PropTypes.object.isRequired,
		children: PropTypes.node,
		component: PropTypes.component,
		syncLocation: PropTypes.bool,
	};

	static defaultProps = {
		component: 'div',
		syncLocation: false,
	};

	static contextTypes = {
		// store: PropTypes.object.isRequired,
		appConfig: PropTypes.object.isRequired,
	};

	constructor(props) {
		super(props);
		const { syncLocation, modalStore } = this.props;
		syncLocation && modalStore.bindRouter(routerStore);
	}

	_close() {
		this.props.modalStore.close();

		// TODO:
		// this.context.store.setSelectedKeys([]);
	}

	_handleOk = (ev) => {
		const { modalProps } = this.props.modalStore;
		if (modalProps.onOk) {
			modalProps.onOk(ev);
		}
		ev.isDefaultPrevented() || this._close();
	};

	_handleCancel = (ev) => {
		const { modalProps } = this.props.modalStore;
		if (modalProps.onCancel) {
			modalProps.onCancel(ev);
		}
		ev.isDefaultPrevented() || this._close();
	};

	render() {
		const {
			context: { appConfig: { modals } },
			props: { modalStore, children, component: Wrap, syncLocation, ...other },
		} = this;
		const { visible, modalProps, state, name } = modalStore;
		const Comp = modals.get(name);
		return (
			<Wrap {...other}>
				{children}
				<Modal
					maskClosable={false}
					{...modalProps}
					visible={visible}
					onOk={this._handleOk}
					onCancel={this._handleCancel}
				>
					{visible && <Comp {...state} />}
				</Modal>
			</Wrap>
		);
	}
}
