import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import { isFunction } from 'utils/fp';
import localize from 'hocs/localize';
import ContextButton from 'components/ContextButton';

@localize('UpdateButton')
export default class UpdateButton extends Component {
	static propTypes = {
		localeStore: PropTypes.object.isRequired,
		table: PropTypes.string,
		title: PropTypes.stringOrFunc,
		label: PropTypes.stringOrFunc,
		multiLabel: PropTypes.stringOrFunc,
		names: PropTypes.array,
		save: PropTypes.stringOrFunc,
	};

	_getModalParams(options, actions, localeStore) {
		const { names, title, label, table, save } = options;
		const { getData } = actions;
		if (save || title || table || names) {
			const getTitle = title || localeStore.localizeProp(label, 'label');
			const params = {
				title: isFunction(getTitle) ? getTitle(getData()) : getTitle,
				save,
				names,
			};
			if (table) params.table = table;
			return params;
		}
	}

	_handleClick = (ev, actions) => {
		ev.preventDefault();
		const { props: { localeStore }, props } = this;
		const { update } = actions;
		const params = this._getModalParams(props, actions, localeStore);
		params ? update(params) : update();
	};

	render() {
		const { title, table, save, names, localeStore, ...other } = this.props;
		return (
			<ContextButton
				{...localeStore.localize(other)}
				onClick={this._handleClick}
				minSelected={1}
			/>
		);
	}
}
