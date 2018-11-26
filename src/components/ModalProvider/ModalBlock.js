import React, { Component } from 'react';
import { observer } from 'mobx-react';
import AppConfigContext from 'contexts/AppConfig';
import ModalStoreContext from 'hocs/withModalStore/ModalStoreContext';

const ModalBody = observer(function ModalBody() {
	return (
		<AppConfigContext.Consumer>
			{({ modals }) => (
				<ModalStoreContext.Consumer>
					{({ name, state }) => {
						const Comp = modals.get(name);
						return <Comp {...state} />;
					}}
				</ModalStoreContext.Consumer>
			)}
		</AppConfigContext.Consumer>
	);
});

export default class ModalBlock extends Component {
	shouldComponentUpdate() {
		return false;
	}

	render() {
		return <ModalBody />;
	}
}
