import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import locale from 'hoc/locale';
import ContextButton from 'components/ContextButton';
import { isFunction } from 'lodash';

@locale({
	defaultProps: {
		label: 'label',
	},
})
export default class RefButton extends Component {
	static propTypes = {
		table: PropTypes.string.isRequired,
		title: PropTypes.stringOrFunc,
		fetch: PropTypes.string,
		save: PropTypes.string,
		noQuery: PropTypes.bool,
		label: PropTypes.stringOrFunc,
	};

	static defaultProps = {
		noQuery: false,
	};

	static contextTypes = {
		store: PropTypes.object,
	};

	_handleClick = (ev, { openRefModal, getData }) => {
		const { props: { title, label, ...other } } = this;
		const getTitle = title || label;
		ev.preventDefault();
		openRefModal({
			...other,
			title: isFunction(getTitle) ? getTitle(getData()) : getTitle,
		});
	};

	render() {
		const { props: { title, table, fetch, save, noQuery, ...other } } = this;

		return <ContextButton {...other} onClick={this._handleClick} />;
	}
}
