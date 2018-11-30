import PropTypes from 'utils/PropTypes';
import React, { Component } from 'react';
import { polyfill } from 'react-lifecycles-compat';
import styles from './styles';
import { isFunction } from 'utils/fp';
import joinKeys from 'utils/joinKeys';
import { observer } from 'mobx-react';
import { REF } from 'constants/Actions';
import ModalControllerContext from 'components/Modal/ModalControllerContext';
import createComponent from 'components/Form/createComponent';
import { Input, Icon, Button } from 'antd';

@observer
@polyfill
class RefSelector extends Component {
	static propTypes = {
		table: PropTypes.string.isRequired,
		fetch: PropTypes.stringOrFunc,
		save: PropTypes.stringOrFunc,
		onChange: PropTypes.func,
		onKeyPress: PropTypes.func,
		value: PropTypes.any,
		placeholder: PropTypes.string,
		style: PropTypes.object,
		label: PropTypes.node,
		width: PropTypes.stringOrNumber,
		render: PropTypes.func,
	};

	static defaultProps = {
		placeholder: '',
		fetch: 'fetch',
		width: '80%',
	};

	static getDerivedStateFromProps({ value }, prevState) {
		return value !== prevState.value ? { value } : null;
	}

	state = {
		value: this.props.value,
	};

	_handleClick = (ev) => {
		const {
			props,
			props: {
				placeholder,
				style,
				onKeyPress,
				onChange,
				save,
				render,
				...other
			},
			modalController,
		} = this;
		ev.preventDefault();
		modalController.open(REF, {
			keys: '',
			async save({ refKeys, refStore }) {
				let val;
				if (save) {
					const { pathname } = refStore;
					const url = joinKeys(refKeys) + `/${pathname}/` + joinKeys(refKeys);
					const options = {
						method: 'POST',
						url,
						...props,
						keys: '',
						refKeys,
						refStore,
					};
					val = await (isFunction(save) ?
						save(options) :
						refStore.call(save, options));
				} else {
					val = refKeys[0];
				}
				onChange(val, refStore);
			},
			...other,
		});
	};

	_handleChange = (ev) => {
		const { value } = ev.currentTarget;
		this.setState({ value });
		this.props.onChange(value);
	};

	_render() {
		const {
			props: { render, style, ...props },
			state: { value },
		} = this;
		return (
			<a
				onClick={this._handleClick}
				href="#"
				style={{ ...styles.button, ...style }}
			>
				{render(value, props)}
			</a>
		);
	}

	_renderInput() {
		const {
			props: { placeholder, style, onKeyPress },
			state: { value },
		} = this;

		return (
			<Input
				style={{ ...styles.button, ...style }}
				placeholder={placeholder}
				value={value}
				size="default"
				onChange={this._handleChange}
				onKeyPress={onKeyPress}
				className="ant-input-search ant-input-search-enter-button"
				suffix={
					<Button
						className="ant-input-search-button"
						onClick={this._handleClick}
					>
						<Icon type="bars" />
					</Button>
				}
			/>
		);
	}

	render() {
		const { render } = this.props;
		return (
			<ModalControllerContext.Consumer>
				{(modalController) => {
					this.modalController = modalController;
					return render ? this._render() : this._renderInput();
				}}
			</ModalControllerContext.Consumer>
		);
	}
}

export default createComponent(RefSelector, {
	displayName: 'RefSelector',
	getValueFromChangeEvent(val) {
		return val;
	},
});
