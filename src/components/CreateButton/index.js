import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import { isFunction } from 'lodash';
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

	static defaultProps = {
		save: 'create',
	};

	_handleClick = (ev, refs) => {
		ev.preventDefault();
		const { props } = this;
		const { openCreaterModal, getSelectedKeysString, getData } = refs;
		const { title, label, table, save, localeStore } = props;
		const getTitle = title || localeStore.localizeProp(label, 'label');
		const params = {
			title: isFunction(getTitle) ? getTitle(getData()) : getTitle,
			save,
		};
		if (table) {
			params.keys = getSelectedKeysString();
			params.table = table;
		}
		openCreaterModal(params);
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
