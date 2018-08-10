import React from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'components/Form';
import Text from 'fields/Text';

export default function EditorField({ style, ...props }) {
	return (
		<Text
			{...props}
			component={Editor}
			style={{
				paddingBottom: 57,
				height: 200,
				lineHeight: 'initial',
				...style,
			}}
		/>
	);
}

EditorField.propTypes = {
	style: PropTypes.object,
};
