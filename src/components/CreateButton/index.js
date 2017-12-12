
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import ContextButton from 'components/ContextButton';

export default class CreateButton extends Component {
	static propTypes = {
		label: PropTypes.node,
		table: PropTypes.string,
		title: PropTypes.string,
		save: PropTypes.string,
	};

	static defaultProps = {
		label: '新建',
		save: 'create',
	};

	_handleClick = (ev, { openCreaterModal, getSelectedKeysString }) => {
		const { label, title, table, save } = this.props;
		const options = { title: title || label, save };
		if (table) {
			options.keys = getSelectedKeysString();
			options.table = table;
		}
		ev.preventDefault();
		openCreaterModal(options);
	};

	render() {
		const { title, table, save, ...other } = this.props;
		return (
			<ContextButton
				onClick={this._handleClick}
				{...other}
			/>
		);
	}
}
