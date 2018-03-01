import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserMenu from 'components/UserMenu';

export default class FrameHeader extends Component {
	static propTypes = {
		style: PropTypes.object,
	};

	static contextTypes = {
		appConfig: PropTypes.object.isRequired,
	};

	render() {
		const {
			props: { style },
			context: { appConfig: { navigator: { noUserMenu } } },
		} = this;
		return <div style={style}>{!noUserMenu && <UserMenu />}</div>;
	}
}
