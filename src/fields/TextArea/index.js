import React from 'react';
import { TextArea, Input } from 'components/Form';
import Text from 'fields/Text';

export default function TextAreaField(props) {
	return <Text {...props} component={TextArea} />;
}

TextAreaField.renderQuery = function renderTable(props) {
	return <Text {...props} component={Input} />;
};
