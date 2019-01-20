import React from 'react';
import { InputNumber } from 'components/Form';
import Text from 'fields/Text';

export default function InputNumberField(props) {
	return <Text {...props} format="number" component={InputNumber} />;
}
