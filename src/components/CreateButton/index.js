import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import ContextButton from 'components/ContextButton';
import { isFunction } from 'lodash';
import localize from 'hocs/localize';

@localize('CreateButton', {
	defaultProps: {
		label: 'label',
	},
})
export default class CreateButton extends Component {
	static propTypes = {
		localeStore: PropTypes.object.isRequired,
		table: PropTypes.string,
		label: PropTypes.stringOrFunc,
		title: PropTypes.stringOrFunc,
		save: PropTypes.string,
	};

	static defaultProps = {
		save: 'create',
	};

	_handleClick = (ev, refs) => {
		const { openCreaterModal, getSelectedKeysString, getData } = refs;
		const { label, title, table, save } = this.props;
		const getTitle = title || label;
		const options = {
			title: isFunction(getTitle) ? getTitle(getData()) : getTitle,
			save,
		};
		if (table) {
			options.keys = getSelectedKeysString();
			options.table = table;
		}
		ev.preventDefault();
		openCreaterModal(options);
	};

	render() {
		const { title, table, save, localeStore, ...other } = this.props;
		return <ContextButton onClick={this._handleClick} {...other} />;
	}
}
