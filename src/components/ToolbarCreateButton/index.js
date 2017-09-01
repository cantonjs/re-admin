
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Button } from 'antd';
import withActions from 'utils/withActions';

@withActions
@observer
export default class ToolbarCreateButton extends Component {
	static propTypes = {
		label: PropTypes.node,
		actions: PropTypes.shape({
			requestCreate: PropTypes.func.isRequired,
		}).isRequired,
	};

	static defaultProps = {
		label: '新建',
		type: 'primary',
	};

	render() {
		const {
			props: {
				actions,
				label,
				...other,
			},
		} = this;
		return (
			<Button
				{...other}
				onClick={actions.requestCreate}
			>
				{label}
			</Button>
		);
	}
}
