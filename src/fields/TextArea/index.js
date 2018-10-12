import React from 'react';
import { TextArea } from 'components/Form';
import Text from 'fields/Text';

export default function TextAreaField(props) {
	return <Text {...props} format="integer" component={TextArea} />;
}
