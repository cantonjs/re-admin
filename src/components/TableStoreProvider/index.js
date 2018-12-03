import React from 'react';
import AppConfigContext from 'contexts/AppConfig';
import TableStoreInternal from './TableStoreInternal';

export default function TableStoreProvider(props) {
	return (
		<AppConfigContext.Consumer>
			{(appConfig) => <TableStoreInternal {...props} appConfig={appConfig} />}
		</AppConfigContext.Consumer>
	);
}
