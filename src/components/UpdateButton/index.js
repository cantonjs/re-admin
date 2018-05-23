import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import ContextButton from 'components/ContextButton';
import { isFunction } from 'lodash';
import localize from 'hocs/localize';

@localize('UpdateButton')
export default class UpdateButton extends Component {
	static propTypes = {
		localeStore: PropTypes.object.isRequired,
		names: PropTypes.array,
		table: PropTypes.string,
		title: PropTypes.stringOrFunc,
		label: PropTypes.stringOrFunc,
		multiLabel: PropTypes.stringOrFunc,
		save: PropTypes.string,
		noRouter: PropTypes.bool,
	};

	static defaultProps = {
		names: [],
		save: 'update',
		noRouter: false,
	};

	_handleClick = (ev, refs) => {
		ev.preventDefault();
		const {
			names,
			title,
			label,
			table,
			save,
			localeStore,
			noRouter,
		} = this.props;
		const { openUpdaterModal, getSelectedKeysString, getData } = refs;
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
		openUpdaterModal(params, { router: !noRouter });
	};

	render() {
		const {
			title,
			table,
			save,
			names,
			localeStore,
			noRouter,
			...other
		} = this.props;
		return (
			<ContextButton
				{...localeStore.localize(other)}
				onClick={this._handleClick}
				minSelected={1}
			/>
		);
	}
}
