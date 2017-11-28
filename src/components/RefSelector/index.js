
import PropTypes from 'utils/PropTypes';
import React, { Component } from 'react';
import styles from './styles';
import { observer } from 'mobx-react';
import createComponent from 'components/Nested/createComponent';
import { Input, Icon } from 'antd';
import RefModal from 'components/RefModal';

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
	};

	static defaultProps = {
		placeholder: '',
	};

	state = {
		value: this.props.value,
		visible: false,
	};

	componentWillReceiveProps({ value }) {
		if (this.props.value !== value) {
			this.setState({ value });
		}
	}

	_handleClick = (ev) => {
		ev.preventDefault();
		this.setState({ visible: true });
	};

	_handleRequestHide = () => {
		this.setState({ visible: false });
	};

	_handleChange = (ev) => {
		const { value } = ev.currentTarget;
		this.setState({ value });
		this.props.onChange(value);
	};

	render() {
		const {
			props: {
				placeholder, style, label, onKeyPress,
				...other,
			},
			state: { value, visible },
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
				<RefModal
					{...other}
					visible={visible}
					onRequestHide={this._handleRequestHide}
				/>
			</div>
		);
	}
}

export default createComponent(RefSelector, {
	displayName: 'NestRefSelector',
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
