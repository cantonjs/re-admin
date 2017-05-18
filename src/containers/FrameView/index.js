
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sidebar from 'components/Sidebar';
import panelsStore from 'stores/panelsStore';

const styles = {
	container: {
		minWidth: 1024,
	},
	main: {
		padding: '40px 60px 40px 300px',
	},
};

export default class FrameView extends Component {
	static propTypes = {
		children: PropTypes.node,
	};

	render() {
		const { children } = this.props;
		return (
			<div style={styles.container}>
				{panelsStore.isShowSidebar &&
					<Sidebar />
				}
				<div style={styles.main}>{children}</div>
			</div>
		);
	}
}
