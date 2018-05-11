import React, { Component, Children, cloneElement } from 'react';
import { createRef } from 'utils/reactPolyfill';
import PropTypes from 'utils/PropTypes';
import field from 'hocs/field';
import { Form, Button, Icon } from 'antd';
import { ArrayOf as NestArrayOf } from 'react-nested-form';
import localize from 'hocs/localize';

const { Item } = Form;

const styles = {
	item: {
		padding: 12,
		margin: '12px 0',
		position: 'relative',
		border: '1px dashed #dedede',
		backgroundColor: '#f4f4f4',
	},
	icon: {
		position: 'absolute',
		right: 12,
		top: 16,
	},
	button: {
		width: '60%',
	},
};

@field
@localize('ArrayOf')
export default class ArrayOf extends Component {
	static propTypes = {
		name: PropTypes.string,
		children: PropTypes.node,
		getValue: PropTypes.func.isRequired,
		wrapperStyle: PropTypes.object,
		defaultItemValue: PropTypes.any,
		addButtonLabel: PropTypes.node,
		localeStore: PropTypes.object.isRequired,
	};

	static defaultProps = {
		defaultItemValue: '',
	};

	static renderTable(props, { text = [] }) {
		return text.join(',');
	}

	_ref = createRef();

	_handleAdd = () => {
		this._ref.current.push(this.props.defaultItemValue);
	};

	_handleRemove = (ev, key) => {
		ev.preventDefault();
		this._ref.current.dropByKey(key);
	};

	render() {
		const {
			getValue,
			children,
			name,
			addButtonLabel,
			wrapperStyle,
			localeStore,
			...other
		} = this.props;

		const child = Children.only(children);

		return (
			<NestArrayOf
				name={name}
				value={this.props.getValue() || []}
				ref={this._ref}
				render={(items) => (
					<Item {...other} style={wrapperStyle}>
						{items.map(({ value, name, key }) => (
							<div style={styles.item} key={key}>
								{cloneElement(child, { name, value, key })}
								<a href="#" onClick={(ev) => this._handleRemove(ev, key)}>
									<Icon style={styles.icon} type="minus-circle-o" />
								</a>
							</div>
						))}
						<Button
							type="dashed"
							onClick={this._handleAdd}
							style={styles.button}
						>
							<Icon type="plus" />{' '}
							{localeStore.localizeProp(addButtonLabel, 'addButtonLabel')}
						</Button>
					</Item>
				)}
			/>
		);
	}
}
