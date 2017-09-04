
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'antd';
import clearSortedInfo from 'utils/clearSortedInfo';
import { observer } from 'mobx-react';

const { Item } = Form;

@observer
export default class ClearSortButton extends Component {
	static propTypes = {
		wrapperStyle: PropTypes.object,
	};

	static defaultProps = {
		children: '默认排序',
	};

	static contextTypes = {
		appConfig: PropTypes.object.isRequired,
		store: PropTypes.object.isRequired,
	};

	_handleClick = (ev) => {
		ev.preventDefault();
		clearSortedInfo(this.context.appConfig);
	};

	render() {
		const {
			props: { wrapperStyle, ...other },
			context: { store },
		} = this;

		if (!store.hasSortableField) { return null; }

		return (
			<Item style={wrapperStyle}>
				<Button
					onClick={this._handleClick}
					disabled={!store.sortedOrder && !store.sortedKey}
					{...other}
				/>
			</Item>
		);
	}
}
