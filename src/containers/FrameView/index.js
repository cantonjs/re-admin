import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import panelsStore from 'stores/panelsStore';
import authStore from 'stores/authStore';
import routerStore from 'stores/routerStore';
import { observer } from 'mobx-react';
import Sidebar from 'components/Sidebar';
import { Spin } from 'antd';

const styles = {
	container: {
		minWidth: 1024,
	},
	main: {
		padding: '40px 60px 40px 300px',
	},
	spinContainer: {
		display: 'block',
		textAlign: 'center',
		padding: 80,
	},
};

@observer
export default class FrameView extends Component {
	static propTypes = {
		children: PropTypes.node,
	};

	componentDidMount() {
		this._requestAuth();
	}

	async _requestAuth() {
		const { pathname, search } = routerStore.location;
		const isOk = await authStore.auth();
		if (!isOk) {
			routerStore.history.replace({
				pathname: '/login',
				search: `ref=${pathname + search}`,
			});
		}
	}

	render() {
		if (authStore.isFetching || !authStore.accessToken) {
			return (
				<div style={styles.spinContainer}>
					<Spin delay={800} />
				</div>
			);
		}

		const { children } = this.props;
		return (
			<div style={styles.container}>
				{panelsStore.isShowSidebar && <Sidebar />}
				<div style={styles.main}>
					<Switch>{children}</Switch>
				</div>
			</div>
		);
	}
}
