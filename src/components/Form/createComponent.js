import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Demon } from 'react-form-mobx';
import { Form } from 'antd';

const { Item } = Form;

export default function createComponent(Comp, options = {}) {
	const {
		displayName = 'InputElement',
		defaultProps,
		...otherOptions
	} = options;

	return class FormElement extends Component {
		static propTypes = {
			required: PropTypes.bool,
			label: PropTypes.node,
			labelCol: PropTypes.object,
			wrapperCol: PropTypes.object,
			colon: PropTypes.bool,
			wrapperStyle: PropTypes.object,
		};

		static displayName = displayName;

		render() {
			const {
				label,
				labelCol,
				wrapperCol,
				colon,
				wrapperStyle,
				...props
			} = this.props;

			return (
				<Demon
					forwardedProps={{
						...defaultProps,
						...props,
					}}
					{...otherOptions}
				>
					{(forwardedProps, { isInvalid, isTouched, errorMessage }) => {
						if (displayName === 'RangePicker') {
							console.log(
								'RangePicker',
								forwardedProps.value,
								typeof forwardedProps.value
							);
						}
						return (
							<Item
								label={label}
								labelCol={labelCol}
								wrapperCol={wrapperCol}
								colon={colon}
								required={props.required}
								validateStatus={isInvalid ? 'error' : 'success'}
								help={isTouched && isInvalid ? errorMessage : ''}
								style={wrapperStyle}
							>
								<Comp {...forwardedProps} />
							</Item>
						);
					}}
				</Demon>
			);

			// return (
			// 	<Demon forwardedProps={props} {...otherOptions}>
			// 		{(forwardedProps, { isInvalid, isTouched, errorMessage }) => (
			// 			<Item
			// 				label={label}
			// 				labelCol={labelCol}
			// 				wrapperCol={wrapperCol}
			// 				colon={colon}
			// 				required={props.required}
			// 				validateStatus={isInvalid ? 'error' : 'success'}
			// 				help={isTouched && isInvalid ? errorMessage : ''}
			// 				style={wrapperStyle}
			// 			>
			// 				<Comp {...forwardedProps} />
			// 			</Item>
			// 		)}
			// 	</Demon>
			// );
		}
	};
}
