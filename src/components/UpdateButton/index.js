import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import ContextButton from 'components/ContextButton';
import localize from 'hocs/localize';

@localize('UpdateButton')
export default class UpdateButton extends Component {
	static propTypes = {
		localeStore: PropTypes.object.isRequired,
		names: PropTypes.array,
		label: PropTypes.stringOrFunc,
		multiLabel: PropTypes.stringOrFunc,
	};

	static defaultProps = {
		names: [],
	};

	_handleClick = (ev, { openUpdaterModal }) => {
		ev.preventDefault();
		openUpdaterModal({ select: this.props.names });
	};

	render() {
		const { props: { names, localeStore, ...other } } = this;
		return (
			<ContextButton
				{...localeStore.localize(other)}
				onClick={this._handleClick}
				minSelected={1}
			/>
		);
	}
}
