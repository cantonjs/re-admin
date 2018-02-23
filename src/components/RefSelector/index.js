import PropTypes from 'utils/PropTypes';
import React, { Component } from 'react';
import styles from './styles';
import { observer } from 'mobx-react';
import modalStore from 'stores/modalStore';
import { REF } from 'constants/Actions';
import createComponent from 'components/Nested/createComponent';
import { Input, Icon } from 'antd';
// import RefModal from 'components/RefModal';

@observer
class RefSelector extends Component {
	static propTypes = {
		table: PropTypes.string.isRequired,
		fetch: PropTypes.string,
		onChange: PropTypes.func,
		onKeyPress: PropTypes.func,
		value: PropTypes.any,
		placeholder: PropTypes.string,
		style: PropTypes.object,
		label: PropTypes.node,
	};

	static defaultProps = {
		placeholder: '',
		fetch: 'fetch',
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
		const { placeholder, style, onKeyPress, onChange, ...other } = this.props;
		ev.preventDefault();
		modalStore.setState({
			keys: '',
			...other,
			name: REF,
			save(ref) {
				// TODO
				if (ref) {
					onChange(ref.refKeys[0], ref.refStore);
				}
			},
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
