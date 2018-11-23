import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import { isFunction } from 'utils/fp';
import localize from 'hocs/localize';
import ContextButton from 'components/ContextButton';

@localize('CreateButton')
export default class CreateButton extends Component {
	static propTypes = {
		localeStore: PropTypes.object.isRequired,
		table: PropTypes.string,
		label: PropTypes.stringOrFunc,
		title: PropTypes.stringOrFunc,
		save: PropTypes.stringOrFunc,
	};

	_handleClick = (ev, actions) => {
		ev.preventDefault();
		const { props } = this;
		const { create, getData } = actions;
		const { title, label, table, save, localeStore } = props;

		if (save || title || table) {
			const getTitle = title || localeStore.localizeProp(label, 'label');
			const params = {
				title: isFunction(getTitle) ? getTitle(getData()) : getTitle,
				save,
			};
			if (table) params.table = table;
			create(params);
		} else create();
	};

	render() {
		const { title, table, save, localeStore, ...other } = this.props;
		return (
			<ContextButton
				onClick={this._handleClick}
				{...localeStore.localize(other)}
			/>
		);
	}
}
