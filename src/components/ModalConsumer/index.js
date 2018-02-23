import { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import modalStore from 'stores/modalStore';

@observer
export default class ModalConsumer extends Component {
	static propTypes = {
		children: PropTypes.node,
	};

	componentWillMount() {
		const { children, ...other } = this.props;
		modalStore.setModalProps(other);
	}

	componentWillUnmount() {
		modalStore.setModalProps({});
	}

	close() {
		modalStore.close();
	}

	render() {
		return Children.only(this.props.children);
	}
}
