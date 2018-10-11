import React from 'react';
import PropTypes from 'prop-types';
import { Editor, Input } from 'components/Form';
import Text from 'fields/Text';

function HtmlField({ style, editorProps, ...props }) {
	return (
		<Text
			{...props}
			{...editorProps}
			component={Editor}
			style={{
				paddingBottom: 57,
				height: 200,
				lineHeight: 'initial',
				...style,
				...editorProps.style,
			}}
		/>
	);
}

HtmlField.propTypes = {
	style: PropTypes.object,
	editorProps: PropTypes.object,
};

HtmlField.defaultProps = {
	editorProps: {},
};

HtmlField.renderQuery = function renderTable(props) {
	// eslint-disable-next-line react/prop-types
	const { editorProps, ...other } = props;
	return <Text {...other} component={Input} />;
};

export default HtmlField;
