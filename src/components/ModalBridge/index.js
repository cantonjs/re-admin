import { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import modalStore from 'stores/ActionModalStore';

@observer
export default class ModalBridge extends Component {
	static propTypes = {
		children: PropTypes.node,
	};

	componentWillMount() {
		const { children, ...other } = this.props;
		modalStore.modalProps = other;
	}

	componentWillUnmount() {
		modalStore.modalProps = {};
	}

	render() {
		return Children.only(this.props.children);
	}
}
