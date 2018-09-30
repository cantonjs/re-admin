import styles from './styles';
import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import panelsStore from 'stores/panelsStore';
import authStore from 'stores/authStore';
import routerStore from 'stores/routerStore';
import naviStore from 'stores/naviStore';
import { observer } from 'mobx-react';
import Sidebar from 'components/Sidebar';
import { Layout } from 'antd';
import SpinBox from 'components/SpinBox';
import FrameHeader from 'components/FrameHeader';
import Breadcrumb from 'components/Breadcrumb';

const { Header, Content, Footer } = Layout;

@observer
export default class FrameView extends Component {
	static propTypes = {
		routes: PropTypes.node.isRequired,
		footer: PropTypes.node,
	};

	static contextTypes = {
		appConfig: PropTypes.object,
	};

	constructor(props, context) {
		super(props, context);

		const { menus } = context.appConfig.navigator;
		const { location } = routerStore;
		naviStore.init(menus, location);
	}

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
				<SpinBox delay={800} style={styles.spinContainer} component={Layout} />
			);
		}

		const { routes, footer } = this.props;
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
						<FrameHeader style={styles.headerRight} />
					</Header>
					<Content style={styles.content}>
						<div style={styles.contentBody}>
							<Switch>{routes}</Switch>
						</div>
					</Content>
					{!!footer && <Footer style={styles.footer}>{footer}</Footer>}
				</Layout>
			</Layout>
		);
	}
}
