
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propTypes as MobxPropTypes } from 'mobx-react';
import { Button } from 'antd';
import withActions from 'utils/withActions';

@withActions
export default class ToolbarUpdateButton extends Component {
	static propTypes = {
		label: PropTypes.node,
		multiLabel: PropTypes.node,
		actions: PropTypes.shape({
			requestUpdate: PropTypes.func.isRequired,
			selectedKeys: MobxPropTypes.observableArray.isRequired,
		}).isRequired,
	};

	static defaultProps = {
		label: '修改',
		multiLabel: '批量修改',
		type: 'primary',
	};

	render() {
		const {
			props: {
				actions: { selectedKeys: { length }, requestUpdate },
				label, multiLabel, ...other,
			},
		} = this;
		return (
			<Button
				{...other}
				onClick={requestUpdate}
				disabled={!length}
			>
				{length > 1 ? multiLabel : label}
			</Button>
		);
	}
}
