import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import ContextButton from 'components/ContextButton';
import { isFunction, isEmpty } from 'lodash';
import localize from 'hocs/localize';

@localize('UpdateButton')
export default class UpdateButton extends Component {
	static propTypes = {
		localeStore: PropTypes.object.isRequired,
		table: PropTypes.string,
		title: PropTypes.stringOrFunc,
		label: PropTypes.stringOrFunc,
		multiLabel: PropTypes.stringOrFunc,
		modalParams: PropTypes.object,
		names: PropTypes.deprecated(
			PropTypes.array,
			'Please use "modalParams" instead'
		),
		save: PropTypes.deprecated(
			PropTypes.string,
			'Please use "modalParams" instead'
		),
	};

	static defaultProps = {
		names: [],
		save: 'update',
		modalParams: {},
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
		const { props: { modalParams, localeStore }, props } = this;
		const { openUpdaterModal } = refs;
		const options = isEmpty(modalParams) ? props : modalParams;
		const params = this._getModalParams(options, refs, localeStore);
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
