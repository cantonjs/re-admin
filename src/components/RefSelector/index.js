import PropTypes from 'utils/PropTypes';
import React, { Component } from 'react';
import { polyfill } from 'react-lifecycles-compat';
import styles from './styles';
import { isFunction } from 'lodash';
import joinKeys from 'utils/joinKeys';
import { observer } from 'mobx-react';
import { REF } from 'constants/Actions';
import withModalStore from 'hocs/withModalStore';
import createComponent from 'components/Form/createComponent';
import { Input, Icon, Button } from 'antd';

@withModalStore()
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
		modalStore: PropTypes.object.isRequired,
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
				modalStore,
				save,
				...other
			},
		} = this;
		ev.preventDefault();
		modalStore.open({
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
			name: REF,
		});
	};

	_handleChange = (ev) => {
		const { value } = ev.currentTarget;
		this.setState({ value });
		this.props.onChange(value);
	};

	render() {
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
}

export default createComponent(RefSelector, {
	displayName: 'RefSelector',
	getValueFromChangeEvent(val) {
		return val;
	},
});
