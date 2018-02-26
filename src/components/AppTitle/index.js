import React from 'react';
import PropTypes from 'utils/PropTypes';

export default function AppTitle(
	{ style, fontSize, color, textAlign, ...other },
	context
) {
	return (
		<h1
			{...other}
			style={{
				margin: 0,
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				fontSize,
				textAlign,
				color,
				...style,
			}}
		>
			{context.appConfig.title}
		</h1>
	);
}

AppTitle.propTypes = {
	style: PropTypes.object,
	fontSize: PropTypes.stringOrNumber,
	textAlign: PropTypes.string,
	color: PropTypes.string,
};

AppTitle.defaultProps = {
	fontSize: 20,
	textAlign: 'center',
	color: 'inherit',
};

AppTitle.contextTypes = {
	appConfig: PropTypes.object,
};
