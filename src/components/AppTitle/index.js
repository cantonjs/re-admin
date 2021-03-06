import React from 'react';
import PropTypes from 'utils/PropTypes';
import invariant from 'tiny-invariant';
import AppConfigContext from 'contexts/AppConfig';

export default function AppTitle({
	style,
	fontSize,
	color,
	textAlign,
	...other
}) {
	return (
		<AppConfigContext.Consumer>
			{(appConfig) => {
				invariant(
					appConfig,
					'You should not use <AppTitle> outside <AppContext>'
				);
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
						{appConfig.title}
					</h1>
				);
			}}
		</AppConfigContext.Consumer>
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
