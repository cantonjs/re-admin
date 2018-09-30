import React, { PureComponent, cloneElement } from 'react';
import PropTypes from 'prop-types';
import naviStore from 'stores/naviStore';
import NaviContext from 'contexts/Navi';

export default class NaviEnhancer extends PureComponent {
	static propTypes = {
		children: PropTypes.node.isRequired,
		naviKey: PropTypes.string,
	};

	constructor(props) {
		super(props);
		naviStore.select(this.props.naviKey);
	}

	render() {
		const { children, ...other } = this.props;
		return (
			<NaviContext.Provider value={other}>
				{cloneElement(children, other)}
			</NaviContext.Provider>
		);
	}
}
