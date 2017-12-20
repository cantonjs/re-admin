
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import ContextButton from 'components/ContextButton';
import { isFunction } from 'lodash';

export default class RefButton extends Component {
	static propTypes = {
		table: PropTypes.string.isRequired,
		title: PropTypes.stringOrFunc,
		fetch: PropTypes.string,
		save: PropTypes.string,
		noQuery: PropTypes.bool,
		label: PropTypes.node,
	};

	static defaultProps = {
		label: '关联',
		noQuery: false,
	};

	static contextTypes = {
		store: PropTypes.object,
	};

	_handleClick = (ev, { openRefModal, getData }) => {
		const { props: { title, label, ...other } } = this;
		let modalTitle = title || label;
		if (isFunction(modalTitle)) {
			modalTitle = modalTitle(getData());
		}
		ev.preventDefault();
		openRefModal({
			...other,
			title: modalTitle,
		});
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
