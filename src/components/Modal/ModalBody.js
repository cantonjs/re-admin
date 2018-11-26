import React from 'react';
import { observer } from 'mobx-react';
import AppConfigContext from 'contexts/AppConfig';
import ModalControllerContext from './ModalControllerContext';

export default observer(function ModalBody() {
	return (
		<AppConfigContext.Consumer>
			{({ modals }) => (
				<ModalControllerContext.Consumer>
					{({ name, state }) => {
						const Comp = modals.get(name);
						return <Comp {...state} />;
					}}
				</ModalControllerContext.Consumer>
			)}
		</AppConfigContext.Consumer>
	);
});
