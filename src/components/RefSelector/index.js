
import PropTypes from 'utils/PropTypes';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { State, HiddenRouterStore } from './Stores';
import createComponent from 'components/Nested/createComponent';
import { Input, Icon, Modal } from 'antd';
import TableBody from 'components/TableBody';
import TableQuery from 'components/TableQuery';

const styles = {
	button: {
		width: '100%',
		textAlign: 'left',
		cursor: 'pointer',
	},
};

@observer
class RefSelector extends Component {
	static propTypes = {
		table: PropTypes.string.isRequired,
		onChange: PropTypes.func,
		onKeyPress: PropTypes.func,
		value: PropTypes.any,
		placeholder: PropTypes.string,
		style: PropTypes.object,
		label: PropTypes.node,
		modalStyle: PropTypes.object,
		modalWidth: PropTypes.stringOrNumber,
		modalTitle: PropTypes.node,
		noModalQuery: PropTypes.bool,
	};

	static defaultProps = {
		modalWidth: '70%',
		placeholder: '',
		noModalQuery: false,
	};

	static contextTypes = {
		DataStore: PropTypes.func.isRequired,
	};

	state = {
		value: this.props.value,
	};

	componentWillMount() {
		const { props: { table }, context: { DataStore } } = this;
		this._state = new State();
		this._store = new DataStore(table);
		this._hiddenRouterStore = new HiddenRouterStore(this._store);
	}

	componentWillReceiveProps({ value }) {
		if (this.props.value !== value) {
			this.setState({ value });
		}
	}

	_handleClick = (ev) => {
		ev.preventDefault();
		this._store.fetch({}, Math.random());
		this._state.visible = true;
	};

	_handleFocus = (ev) => {
		ev.currentTarget.blur();
	};

	_handleCancel = () => {
		this._state.visible = false;
	};

	_handleOk = () => {
		const { onChange } = this.props;
		this._state.visible = false;
		onChange(this._store.selectedKeys[0]);
	};

	_handleChange = (ev) => {
		const { value } = ev.currentTarget;
		this.setState({ value });
		this.props.onChange(value);
	};

	render() {
		const {
			_state: { visible },
			_hiddenRouterStore,
			_store,
			props: {
				placeholder, style, label,
				modalWidth, modalStyle, modalTitle, noModalQuery,
				onKeyPress,
			},
			state: { value },
		} = this;

		return (
			<div>
				<Input
					style={{ ...styles.button, ...style }}
					placeholder={placeholder}
					value={value}
					size="large"
					onChange={this._handleChange}
					onKeyPress={onKeyPress}
					addonAfter={
						<a href="#" onClick={this._handleClick}>
							<Icon type="bars" />
						</a>
					}
				/>
				<Modal
					title={modalTitle || label || '引用'}
					style={{ ...modalStyle, minWidth: modalWidth }}
					maskClosable={false}
					visible={visible}
					onCancel={this._handleCancel}
					onOk={this._handleOk}
				>
					{!noModalQuery &&
						<TableQuery
							store={_store}
							routerStore={_hiddenRouterStore}
						/>
					}
					<TableBody
						store={_store}
						routerStore={_hiddenRouterStore}
						selectionType="radio"
					/>
				</Modal>
			</div>
		);
	}
}

export default createComponent(RefSelector, {
	displayName: 'NestInput',
	onChange(val) { return val; },
	render(props, originalProps, Component) {
		return (
			<Component
				{...props}
				label={originalProps.label}
			/>
		);
	},
});
