import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import localize from 'hocs/localize';
import withStore from 'hocs/withStore';
import ContextButton from 'components/ContextButton';
import { isFunction } from 'lodash';

@withStore()
@localize('RefButton')
export default class RefButton extends Component {
	static propTypes = {
		localeStore: PropTypes.object.isRequired,
		table: PropTypes.string.isRequired,
		title: PropTypes.stringOrFunc,
		fetch: PropTypes.string,
		save: PropTypes.string,
		noQuery: PropTypes.bool,
		label: PropTypes.stringOrFunc,
		store: PropTypes.object,
	};

	static defaultProps = {
		noQuery: false,
	};

	_handleClick = (ev, { openRefModal, getData }) => {
		const { props: { title, label, localeStore, ...other } } = this;
		const getTitle = title || localeStore.localizeProp(label, 'label');
		ev.preventDefault();
		openRefModal({
			...other,
			title: isFunction(getTitle) ? getTitle(getData()) : getTitle,
		});
	};

	render() {
		const {
			props: { title, table, fetch, save, noQuery, localeStore, ...other },
		} = this;
		return (
			<ContextButton
				{...localeStore.localize(other)}
				onClick={this._handleClick}
			/>
		);
	}
}
