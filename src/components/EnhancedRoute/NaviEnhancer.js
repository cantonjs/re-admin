import { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';
import naviStore from 'stores/naviStore';

export default class NaviEnhancer extends PureComponent {
	static propTypes = {
		children: PropTypes.node.isRequired,
		menuKey: PropTypes.string,
	};

	constructor(props) {
		super(props);
		naviStore.select(this.props.menuKey);
	}

	render() {
		return Children.only(this.props.children);
	}
}
