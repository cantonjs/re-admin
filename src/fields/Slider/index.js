import React from 'react';
import { Slider } from 'components/Form';
import Text from 'fields/Text';

export default function SliderField(props) {
	return <Text {...props} format="integer" component={Slider} />;
}
