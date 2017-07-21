
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import routerStore from 'stores/router';

const styles = {
	container: {
		height: '100%',
	},
};

@withRouter
export default class RouterContext extends Component {
	static propTypes = {
		children: PropTypes.node.isRequired,
		match: PropTypes.object.isRequired,
		history: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
	};

	componentWillMount() {
		routerStore.init(this.props);
	}

	componentWillReceiveProps({ location, match, history }) {
		const prevProps = this.props;
		if (prevProps.location !== location) { routerStore.update({ location }); }
		if (prevProps.match !== match) { routerStore.update({ match }); }
		if (prevProps.history !== history) { routerStore.update({ history }); }
	}

	render() {
		return (
			<div style={styles.container}>{this.props.children}</div>
		);
	}
}

