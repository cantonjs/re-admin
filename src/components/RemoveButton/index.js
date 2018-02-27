import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import { localeHoc, createLocale } from 'hoc/locale';
import { TOOLBAR } from 'constants/Issuers';
import ConfirmButton from 'components/ConfirmButton';

const locale = createLocale('RemoveButton');

@localeHoc
export default class RemoveButton extends Component {
	static propTypes = {
		label: PropTypes.stringOrFunc,
		multiLabel: PropTypes.stringOrFunc,
		title: PropTypes.stringOrFunc,
		content: PropTypes.stringOrFunc,
	};

	static defaultProps = {
		label: locale.label,
		multiLabel: locale.multiLabel,
		title: locale.title,
		content: locale.content,
	};

	static contextTypes = {
		issuer: PropTypes.instanceOf(Set),
		store: PropTypes.object.isRequired,
	};

	_handleOk = ({ getSelectedKeysString }) => {
		this.context.store.remove({ url: getSelectedKeysString() });
	};

	render() {
		const { issuer } = this.context;
		const isInToolbar = issuer && issuer.has(TOOLBAR);
		const styleTypes = {};
		if (isInToolbar) {
			styleTypes.type = 'danger';
		}
		return (
			<ConfirmButton
				onOk={this._handleOk}
				{...styleTypes}
				{...this.props}
				minSelected={1}
			/>
		);
	}
}
