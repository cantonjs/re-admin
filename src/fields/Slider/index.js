
import React from 'react';
import { Slider } from 'components/Nested';
import Text from 'fields/Text';

export default function SliderField(props) {
	return (
		<Text
			{...props}
			dataType="integer"
			component={Slider}
		/>
	);
}
