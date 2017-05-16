
import 'antd/dist/antd.less';
import $$ from './style.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sidebar from 'components/Sidebar';
import panelsStore from 'stores/panels';

export default class FrameView extends Component {
	static propTypes = {
		children: PropTypes.node,
	};

	render() {
		const { children } = this.props;
		return (
			<div className={$$.container}>
				{panelsStore.isShowSidebar &&
					<Sidebar />
				}
				<div className={$$.main}>{children}</div>
			</div>
		);
	}
}
