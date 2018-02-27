import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import ContextButton from 'components/ContextButton';
import { localeHoc, createLocale } from 'hoc/locale';

const locale = createLocale('UpdateButton');

@localeHoc
export default class UpdateButton extends Component {
	static propTypes = {
		names: PropTypes.array,
		label: PropTypes.stringOrFunc,
		multiLabel: PropTypes.stringOrFunc,
	};

	static defaultProps = {
		label: locale.label,
		multiLabel: locale.multiLabel,
		names: [],
	};

	_handleClick = (ev, { openUpdaterModal }) => {
		ev.preventDefault();
		openUpdaterModal({ select: this.props.names });
	};

	render() {
		const { props: { names, ...other } } = this;

		return (
			<ContextButton {...other} onClick={this._handleClick} minSelected={1} />
		);
	}
}
