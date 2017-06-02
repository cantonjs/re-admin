
import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import Sidebar from 'components/Sidebar';
import panelsStore from 'stores/panelsStore';
import router from 'stores/router';

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
		location: PropTypes.any.isRequired,
		params: PropTypes.any.isRequired,
		router: PropTypes.any.isRequired,
		routes: PropTypes.any.isRequired,
		route: PropTypes.any.isRequired,
	};

	componentDidMount() {
		router.init(this.props);
	}

	componentWillReceiveProps({ location, routes, route, params }) {
		const prevProps = this.props;
		if (prevProps.location !== location) { router.update({ location }); }
		if (prevProps.routes !== routes) { router.update({ routes }); }
		if (prevProps.route !== route) { router.update({ route }); }
		if (prevProps.params !== params) { router.update({ params }); }
	}

	render() {
		const { children, location: { pathname } } = this.props;
		return (
			<div style={styles.container}>
				{panelsStore.isShowSidebar &&
					<Sidebar />
				}
				<div style={styles.main}>
					{cloneElement(children, { key: pathname })}
				</div>
			</div>
		);
	}
}
