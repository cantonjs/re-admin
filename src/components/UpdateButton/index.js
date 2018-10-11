import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import { isFunction } from 'lodash';
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
		save: PropTypes.string,
	};

	static defaultProps = {
		names: [],
		save: 'update',
	};

	_getModalParams(options, refs, localeStore) {
		const { names, title, label, table, save } = options;
		const { getSelectedKeysString, getData } = refs;
		const getTitle = title || localeStore.localizeProp(label, 'label');
		const params = {
			title: isFunction(getTitle) ? getTitle(getData()) : getTitle,
			save,
			select: names,
		};
		if (table) {
			params.keys = getSelectedKeysString();
			params.table = table;
		}
		return params;
	}

	_handleClick = (ev, refs) => {
		ev.preventDefault();
		const { props: { localeStore }, props } = this;
		const { openUpdaterModal } = refs;
		const params = this._getModalParams(props, refs, localeStore);
		openUpdaterModal(params);
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
