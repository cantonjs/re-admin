
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Button } from 'antd';

@observer
export default class ButtonCreate extends Component {
	static propTypes = {
		label: PropTypes.node,
	};

	static defaultProps = {
		label: '新建',
		type: 'primary',
	};

	static contextTypes = {
		store: PropTypes.object.isRequired,
		updateLocationQuery: PropTypes.func.isRequired,
	};

	_handleClick = () => {
		this.context.updateLocationQuery({ action: 'create' });
	};

	render() {
		const {
			props: {
				label,
				...other,
			},
		} = this;
		return (
			<Button
				{...other}
				onClick={this._handleClick}
			>
				{label}
			</Button>
		);
	}
}
