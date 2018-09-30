import { PureComponent, cloneElement } from 'react';
import PropTypes from 'prop-types';
import naviStore from 'stores/naviStore';

export default class NaviEnhancer extends PureComponent {
	static propTypes = {
		children: PropTypes.node.isRequired,
		menuKey: PropTypes.string,
	};

	constructor(props) {
		super(props);
		const { children, ...other } = props;
		naviStore.setState(other);
	}

	render() {
		const { children, ...other } = this.props;
		return cloneElement(children, other);
	}
}
