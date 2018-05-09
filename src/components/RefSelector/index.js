import PropTypes from 'utils/PropTypes';
import React, { Component } from 'react';
import styles from './styles';
import { observer } from 'mobx-react';
import { REF } from 'constants/Actions';
import withModalStore from 'hocs/withModalStore';
import createComponent from 'components/Nested/createComponent';
import { Input, Icon } from 'antd';

@withModalStore()
@observer
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

	state = {
		value: this.props.value,
	};

	componentWillReceiveProps({ value }) {
		if (this.props.value !== value) {
			this.setState({ value });
		}
	}

	_handleClick = (ev) => {
		const {
			placeholder,
			style,
			onKeyPress,
			onChange,
			modalStore,
			...other
		} = this.props;
		ev.preventDefault();
		modalStore.setState({
			keys: '',
			save({ refKeys, refStore }) {
				onChange(refKeys[0], refStore);
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
				size="large"
				onChange={this._handleChange}
				onKeyPress={onKeyPress}
				addonAfter={
					<a href="#" onClick={this._handleClick}>
						<Icon type="bars" />
					</a>
				}
			/>
		);
	}
}

export default createComponent(RefSelector, {
	displayName: 'NestRefSelector',
	onChange(val) {
		return val;
	},
	render(props, originalProps, Component) {
		return <Component {...props} label={originalProps.label} />;
	},
});
