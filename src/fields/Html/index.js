import React from 'react';
import PropTypes from 'prop-types';
import { Editor, Input } from 'components/Form';
import Text from 'fields/Text';

function HtmlField({ style, ...props }) {
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

HtmlField.propTypes = {
	style: PropTypes.object,
};

HtmlField.renderQuery = function renderTable(props) {
	return <Text {...props} component={Input} />;
};

export default HtmlField;
