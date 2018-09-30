import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import { observer } from 'mobx-react';
import { withModalStoreProvider } from 'hocs/withModalStore';
import { Modal } from 'antd';

@withModalStoreProvider()
@observer
export default class ModalProvider extends Component {
	static propTypes = {
		modalStore: PropTypes.object.isRequired,
		children: PropTypes.node,
		component: PropTypes.component,
	};

	static defaultProps = {
		component: 'div',
	};

	static contextTypes = {
		appConfig: PropTypes.object.isRequired,
	};

	_close() {
		this.props.modalStore.close();
	}

	_handleOk = (ev) => {
		const { modalProps } = this.props.modalStore;
		if (modalProps.onOk) modalProps.onOk(ev);
		ev.isDefaultPrevented() || this._close();
	};

	_handleCancel = (ev) => {
		const { modalProps } = this.props.modalStore;
		if (modalProps.onCancel) modalProps.onCancel(ev);
		ev.isDefaultPrevented() || this._close();
	};

	render() {
		const {
			context: { appConfig: { modals } },
			props: { modalStore, children, component: Wrap, ...other },
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
