import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import localize from 'hocs/localize';
import withIssuer from 'hocs/withIssuer';
import withStore from 'hocs/withStore';
import { TOOLBAR } from 'utils/Issuers';
import ConfirmButton from 'components/ConfirmButton';

@withIssuer()
@withStore()
@localize('RemoveButton')
export default class RemoveButton extends Component {
	static propTypes = {
		localeStore: PropTypes.object.isRequired,
		label: PropTypes.stringOrFunc,
		multiLabel: PropTypes.stringOrFunc,
		title: PropTypes.stringOrFunc,
		content: PropTypes.stringOrFunc,
		issuers: PropTypes.instanceOf(Set).isRequired,
		store: PropTypes.object.isRequired,
	};

	_handleOk = ({ getSelectedKeysString }) => {
		this.props.store.remove({ url: getSelectedKeysString() });
	};

	render() {
		const { issuers, localeStore, ...other } = this.props;
		const isInToolbar = issuers.has(TOOLBAR);
		const styleTypes = {};
		if (isInToolbar) styleTypes.type = 'danger';
		return (
			<ConfirmButton
				onOk={this._handleOk}
				{...styleTypes}
				{...localeStore.localize(other)}
				minSelected={1}
			/>
		);
	}
}
