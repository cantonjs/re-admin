import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import localize from 'hocs/localize';
import withIssuer from 'hocs/withIssuer';
import { TOOLBAR } from 'utils/Issuers';
import ConfirmButton from 'components/ConfirmButton';

@withIssuer()
@localize({
	defaultProps: {
		label: 'label',
		multiLabel: 'multiLabel',
		title: 'title',
		content: 'content',
	},
})
export default class RemoveButton extends Component {
	static propTypes = {
		label: PropTypes.stringOrFunc,
		multiLabel: PropTypes.stringOrFunc,
		title: PropTypes.stringOrFunc,
		content: PropTypes.stringOrFunc,
		issuers: PropTypes.instanceOf(Set).isRequired,
	};

	static contextTypes = {
		store: PropTypes.object.isRequired,
	};

	_handleOk = ({ getSelectedKeysString }) => {
		this.context.store.remove({ url: getSelectedKeysString() });
	};

	render() {
		const { issuers, ...other } = this.props;
		const isInToolbar = issuers.has(TOOLBAR);
		const styleTypes = {};
		if (isInToolbar) styleTypes.type = 'danger';
		return (
			<ConfirmButton
				onOk={this._handleOk}
				{...styleTypes}
				{...other}
				minSelected={1}
			/>
		);
	}
}
