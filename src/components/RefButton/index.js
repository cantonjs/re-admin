
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import ContextButton from 'components/ContextButton';

export default class RefButton extends Component {
	static propTypes = {
		table: PropTypes.string.isRequired,
		title: PropTypes.string,
		fetch: PropTypes.string,
		save: PropTypes.string,
		noQuery: PropTypes.bool,
		label: PropTypes.node,
	};

	static defaultProps = {
		label: '关联',
		title: '关联',
		fetch: 'fetch',
		save: 'update',
		noQuery: false,
	};

	static contextTypes = {
		store: PropTypes.object,
	};

	_handleClick = (ev, { openRefModal }) => {
		ev.preventDefault();
		openRefModal(this.props);
	};

	render() {
		const {
			props: { title, table, fetch, save, noQuery, ...other },
		} = this;

		return (
			<ContextButton {...other} onClick={this._handleClick} />
		);
	}
}
