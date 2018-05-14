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
		noRouter: PropTypes.bool,
	};

	static defaultProps = {
		names: [],
		noRouter: false,
	};

	_handleClick = (ev, { openUpdaterModal }) => {
		ev.preventDefault();
		const { names, noRouter } = this.props;
		openUpdaterModal({ select: names }, { router: !noRouter });
	};

	render() {
		const { props: { names, localeStore, noRouter, ...other } } = this;
		return (
			<ContextButton
				{...localeStore.localize(other)}
				onClick={this._handleClick}
				minSelected={1}
			/>
		);
	}
}
