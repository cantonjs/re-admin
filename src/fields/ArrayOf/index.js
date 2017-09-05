
import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'utils/PropTypes';
import { observer } from 'mobx-react';
import withField from 'utils/withField';
import { Form, Button, Icon } from 'antd';
import { ArrayOf as NestArrayOf } from 'react-nested-form';

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
	};

	static renderTable(props, { text = [] }) {
		return text.join(',');
	}

	_handleAdd = () => {
		this._node.push(this.props.defaultItemValue);
	};

	_handleRemove = (ev, key) => {
		ev.preventDefault();
		this._node.dropByKey(key);
	};

	render() {
		const {
			getValue, children, name, addButtonLabel, wrapperStyle,
			...other,
		} = this.props;

		const child = Children.only(children);

		return (
			<NestArrayOf
				name={name}
				value={this.props.getValue() || []}
				ref={(c) => (this._node = c)}
				render={(items) =>
					<Item
						{...other}
						style={wrapperStyle}
					>
						{items.map(({ value, name, key }) =>
							<div style={styles.item} key={key}>
								{cloneElement(child, { name, value, key })}
								<a href="#" onClick={(ev) => this._handleRemove(ev, key)}>
									<Icon
										style={styles.icon}
										type="minus-circle-o"
									/>
								</a>
							</div>
						)}
						<Button
							type="dashed"
							onClick={this._handleAdd}
							style={styles.button}
						>
							<Icon type="plus" /> {addButtonLabel}
						</Button>
					</Item>
				}
			/>
		);
	}
}
