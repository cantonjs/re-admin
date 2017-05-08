
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Button } from 'antd';

@observer
export default class ButtonRemove extends Component {
	static propTypes = {
		label: PropTypes.node,
	};

	static defaultProps = {
		label: '删除',
		type: 'danger',
	};

	static contextTypes = {
		store: PropTypes.object.isRequired,
	};

	_handleClick = () => {
		this.context.store.remove();
	};

	render() {
		const {
			props: { label, ...other },
			context: { store: { selectedKeys } },
		} = this;
		return (
			<Button
				{...other}
				onClick={this._handleClick}
				disabled={!selectedKeys.length}
			>
				{label}
			</Button>
		);
	}
}
