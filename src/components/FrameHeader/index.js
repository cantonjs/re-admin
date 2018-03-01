import styles from './styles';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserMenu from 'components/UserMenu';
import Navi from 'components/Navi';
import { Divider } from 'antd';

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
			context: { appConfig: { navigator: { noUserMenu, topMenu } } },
		} = this;
		return (
			<div style={style}>
				{!!topMenu.length && (
					<Navi
						top
						menu={topMenu}
						style={styles.menu}
						itemStyle={styles.menuItem}
					/>
				)}
				<Divider type="vertical" />
				{!noUserMenu && <UserMenu />}
			</div>
		);
	}
}
