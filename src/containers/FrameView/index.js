import styles from './styles';
import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import panelsStore from 'stores/panelsStore';
import authStore from 'stores/authStore';
import routerStore from 'stores/routerStore';
import { observer } from 'mobx-react';
import Sidebar from 'components/Sidebar';
import { Spin, Layout } from 'antd';
import UserMenu from 'components/UserMenu';
import Breadcrumb from 'components/Breadcrumb';

const { Header, Content, Footer } = Layout;

@observer
export default class FrameView extends Component {
	static propTypes = {
		children: PropTypes.node.isRequired,
		footer: PropTypes.node,
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
				<Layout style={styles.spinContainer}>
					<Spin delay={800} />
				</Layout>
			);
		}

		const { children, footer } = this.props;
		return (
			<Layout style={styles.container}>
				<Sidebar />
				<Layout
					style={{ marginLeft: panelsStore.isSidebarCollapsed ? 80 : 200 }}
				>
					<Header style={styles.header}>
						<div style={styles.headerLeft}>
							<Breadcrumb style={styles.breadcrumb} />
						</div>
						<div style={styles.headerRight}>
							<UserMenu style={styles.footer} />
						</div>
					</Header>
					<Content style={styles.content}>
						<div style={styles.contentBody}>
							<Switch>{children}</Switch>
						</div>
					</Content>
					{!!footer && <Footer style={styles.footer}>{footer}</Footer>}
				</Layout>
			</Layout>
		);
	}
}
