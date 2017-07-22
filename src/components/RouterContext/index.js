
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import routerStore from 'stores/routerStore';

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

	static childContextTypes = {
		routerStore: PropTypes.object,
	};

	getChildContext() {
		return { routerStore };
	}

	componentWillMount() {
		routerStore.init(this.props);
	}

	componentWillReceiveProps({ match }) {
		if (this.props.match !== match) { routerStore.__setMatch(match); }
	}

	render() {
		return (
			<div style={styles.container}>{this.props.children}</div>
		);
	}
}

