import { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class ModalPropsUpdater extends PureComponent {
	static propTypes = {
		modalProps: PropTypes.object,
	};

	constructor(props) {
		super(props);
		const { modalProps, ...restProps } = props;
		modalProps.set(restProps);
	}

	componentDidUpdate() {
		const { modalProps, ...restProps } = this.props;
		modalProps.set(restProps);
	}

	render() {
		return null;
	}
}
