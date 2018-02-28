import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import ContextButton from 'components/ContextButton';
import locale from 'hoc/locale';

@locale({
	defaultProps: {
		label: 'label',
		multiLabel: 'multiLabel',
	},
})
export default class UpdateButton extends Component {
	static propTypes = {
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
		const { props: { names, ...other } } = this;

		return (
			<ContextButton {...other} onClick={this._handleClick} minSelected={1} />
		);
	}
}
