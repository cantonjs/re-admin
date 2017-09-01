
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propTypes as MobxPropTypes } from 'mobx-react';
import { Button } from 'antd';
import withActions from 'utils/withActions';

@withActions
export default class ToolbarRemoveButton extends Component {
	static propTypes = {
		label: PropTypes.node,
		multiLabel: PropTypes.node,
		actions: PropTypes.shape({
			requestRemove: PropTypes.func.isRequired,
			selectedKeys: MobxPropTypes.observableArray.isRequired,
		}).isRequired,
	};

	static defaultProps = {
		label: '删除',
		multiLabel: '批量删除',
		type: 'danger',
	};

	render() {
		const {
			props: {
				actions: { selectedKeys: { length }, requestRemove },
				label, multiLabel, ...other,
			},
		} = this;
		return (
			<Button
				{...other}
				onClick={requestRemove}
				disabled={!length}
			>
				{length > 1 ? multiLabel : label}
			</Button>
		);
	}
}
