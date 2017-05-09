
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Button } from 'antd';

@observer
export default class ButtonUpdate extends Component {
	static propTypes = {
		label: PropTypes.node,
		multiLabel: PropTypes.node,
	};

	static defaultProps = {
		label: '修改',
		multiLabel: '批量修改',
	};

	static contextTypes = {
		store: PropTypes.object.isRequired,
		updateLocationQuery: PropTypes.func.isRequired,
	};

	_handleClick = () => {
		const { updateLocationQuery, store } = this.context;
		updateLocationQuery({
			action: 'update',
			selectedKeys: store.selectedKeys.join(','),
		});
	};

	render() {
		const {
			props: { label, multiLabel, ...other },
			context: { store: { selectedKeys: { length } } },
		} = this;
		return (
			<Button
				{...other}
				onClick={this._handleClick}
				disabled={!length}
			>
				{length > 1 ? multiLabel : label}
			</Button>
		);
	}
}
