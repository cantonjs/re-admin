import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Demon } from 'react-form-mobx';
import { Form } from 'antd';

const { Item } = Form;

const defaultStyle = {
	marginBottom: 12,
};

export default function createComponent(Comp, options = {}) {
	const {
		displayName = 'InputElement',
		defaultProps,
		...otherOptions
	} = options;

	return class FormElement extends PureComponent {
		static propTypes = {
			required: PropTypes.bool,
			label: PropTypes.node,
			labelCol: PropTypes.object,
			wrapperCol: PropTypes.object,
			colon: PropTypes.bool,
			wrapperStyle: PropTypes.object,
		};

		static displayName = displayName;

		static getDrivedStateFromProps({ wrapperStyle }, state) {
			if (wrapperStyle !== state.wrapperStyle) {
				return {
					wrapperStyle,
					style: {
						...defaultStyle,
						...wrapperStyle,
					},
				};
			}
			return null;
		}

		constructor(props) {
			super(props);

			const { wrapperStyle } = props;
			this.state = {
				wrapperStyle,
				style: {
					...defaultStyle,
					...wrapperStyle,
				},
			};
		}

		render() {
			const {
				label,
				labelCol,
				wrapperCol,
				colon,
				wrapperStyle,
				...props
			} = this.props;
			const { style } = this.state;

			return (
				<Demon forwardedProps={props} {...otherOptions}>
					{(forwardedProps, { isInvalid, isTouched, errorMessage }) => (
						<Item
							label={label}
							labelCol={labelCol}
							wrapperCol={wrapperCol}
							colon={colon}
							required={props.required}
							validateStatus={isTouched && isInvalid ? 'error' : 'success'}
							help={isTouched && isInvalid ? errorMessage : ''}
							style={style}
						>
							<Comp {...forwardedProps} />
						</Item>
					)}
				</Demon>
			);
		}
	};
}
