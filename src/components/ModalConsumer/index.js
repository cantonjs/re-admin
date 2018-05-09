import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import withModalStore from 'hocs/withModalStore';
import ModalProvider from 'components/ModalProvider';

@withModalStore()
@observer
export default class ModalConsumer extends Component {
	static propTypes = {
		children: PropTypes.node,
		modalStore: PropTypes.object.isRequired,
	};

	componentWillMount() {
		const { children, modalStore, ...other } = this.props;
		modalStore.setModalProps(other);
	}

	componentWillUnmount() {
		this.props.modalStore.setModalProps({});
	}

	close = () => {
		this.props.modalStore.close();
	};

	render() {
		const { modalStore, children } = this.props;
		return <ModalProvider modalStore={modalStore}>{children}</ModalProvider>;
	}
}
