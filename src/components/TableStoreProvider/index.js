import React from 'react';
import AppConfigContext from 'contexts/AppConfig';
import StoreContext from 'contexts/Store';
import TableStoreInternal from './TableStoreInternal';

export default function TableStoreProvider(props) {
	return (
		<AppConfigContext.Consumer>
			{(appConfig) => (
				<StoreContext.Consumer>
					{(parentStore) => (
						<TableStoreInternal
							{...props}
							appConfig={appConfig}
							parentStore={parentStore}
						/>
					)}
				</StoreContext.Consumer>
			)}
		</AppConfigContext.Consumer>
	);
}
