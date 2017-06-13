
import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'utils/PropTypes';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import withField from 'utils/withField';
import { Form, Button, Icon } from 'antd';
import ArrayItem from './ArrayItem';
import { remove } from 'lodash';
import { returnsArgument } from 'empty-functions';

const { Item } = Form;

@withField
@observer
export default class ArrayOf extends Component {
	static propTypes = {
		name: PropTypes.string,
		children: PropTypes.node,
		getValue: PropTypes.func.isRequired,
		wrapperStyle: PropTypes.object,
		defaultItemValue: PropTypes.any,
		addButtonLabel: PropTypes.node,
	};

	static defaultProps = {
		defaultItemValue: '',
		addButtonLabel: '增加项',
		render: (value = []) => value.join(','),
		dataType: returnsArgument,
	};

	_uuid = 0;

	componentWillMount() {
		const values = this.props.getValue() || [];
		this._state = observable(values.map((value) => ({
			value,
			key: this._getKey(),
		})));
	}

	_getKey() {
		return ++this._uuid;
	}

	_handleAdd = () => {
		const { defaultItemValue } = this.props;
		this._state.push({ value: defaultItemValue, key: this._getKey() });
	};

	_handleRemove = (key) => {
		remove(this._state, (item) => item.key === key);
	};

	render() {
		const {
			getValue, children, name, addButtonLabel, wrapperStyle,
			...other,
		} = this.props;

		const child = Children.only(children);

		return (
			<Item
				// validateStatus={isValid ? 'error' : 'success'}
				// help={errorMessage}
				{...other}
				style={wrapperStyle}
			>
				{this._state.map(({ value, key }) =>
					<ArrayItem
						key={key}
						id={key}
						onRequestRemove={this._handleRemove}
					>
						{cloneElement(child, {
							name: `${name}[]`,
							value,
						})}
					</ArrayItem>
				)}
				<Button type="dashed" onClick={this._handleAdd} style={{ width: '60%' }}>
					<Icon type="plus" /> {addButtonLabel}
				</Button>
			</Item>
		);
	}
}
