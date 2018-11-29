import React, { Component } from 'react';
import PropTypes from 'prop-types';
import naviStore from 'stores/naviStore';

export default class PageTitle extends Component {
	static propTypes = {
		title: PropTypes.node.isRequired,
	};

	constructor(props) {
		super(props);

		naviStore.setBreadcrumbTitle(props.title);
	}

	componentDidUpdate(prevProps) {
		const { title } = this.props;
		if (prevProps.title !== title) {
			naviStore.setBreadcrumbTitle(title);
		}
	}

	render() {
		return <h1>{this.props.title}</h1>;
	}
}
