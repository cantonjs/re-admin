
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Table extends Component {
	static propTypes = {
		route: PropTypes.shape({
			table: PropTypes.string.isRequired,
		}),
	};

	componentWillMount() {
		console.log('table:', this.props.route.table);
	}

	render() {
		return (
			<h1>Table</h1>
		);
	}
}
