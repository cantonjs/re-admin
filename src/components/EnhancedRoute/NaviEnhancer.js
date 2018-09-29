import { Component, Children } from 'react';
import PropTypes from 'prop-types';
import naviStore from 'stores/naviStore';

export default class NaviEnhancer extends Component {
	static propTypes = {
		children: PropTypes.node.isRequired,
		menuKey: PropTypes.string,
	};

	constructor(props) {
		super(props);
		naviStore.select(this.props.menuKey);
	}

	shouldComponentUpdate() {
		return false;
	}

	render() {
		return Children.only(this.props.children);
	}
}
