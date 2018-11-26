import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import withModalStore from 'hocs/withModalStore';
import withIssuer from 'hocs/withIssuer';
import { MODAL } from 'utils/Issuers';
import ModalProvider from 'components/ModalProvider';

@withIssuer({ issuer: MODAL })
@withModalStore()
@observer
export default class ModalConsumer extends Component {
	static propTypes = {
		children: PropTypes.node,
		modalStore: PropTypes.object.isRequired,
	};

	constructor(props) {
		super(props);
		const { children, modalStore, ...restProps } = props;
		modalStore.setModalProps(restProps);
	}

	componentDidUpdate(prevProps) {
		const { props } = this;
		if (prevProps !== props) {
			const { modalStore, ...restProps } = props;
			modalStore.setModalProps(restProps);
		}
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
