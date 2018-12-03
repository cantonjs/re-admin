import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Actions from './Actions';
import hoist, { extractRef } from 'hocs/hoist';
import withStore from 'hocs/withStore';
import withIssuer from 'hocs/withIssuer';
import ModalControllerContext from 'components/Modal/ModalControllerContext';
import PageContext from 'contexts/PageContext';
import TableRowKeyContext from 'contexts/TableRowKey';

// Notice that this `Action` is NOT Redux or MobX action.
export default function withActions(WrappedComponent) {
	@hoist(WrappedComponent)
	@withIssuer()
	@withStore()
	@observer
	class WithActions extends Component {
		static propTypes = {
			store: PropTypes.object.isRequired,
			issuers: PropTypes.instanceOf(Set).isRequired,
			pageContext: PropTypes.object,
			tableRowKey: PropTypes.string,
			enforceModal: PropTypes.bool,
		};

		static defaultProps = {
			enforceModal: false,
		};

		actions = new Actions(this);

		render() {
			const {
				props: { store, pageContext, tableRowKey, enforceModal, ...props },
				actions,
			} = this;
			return (
				<ModalControllerContext.Consumer>
					{(modalController) => {
						this.modalController = modalController;
						return (
							<WrappedComponent {...extractRef(props)} actions={actions} />
						);
					}}
				</ModalControllerContext.Consumer>
			);
		}
	}

	function WithActionsWrapper(props) {
		return (
			<PageContext.Consumer>
				{(pageContext) => (
					<TableRowKeyContext.Consumer>
						{(tableRowKey) => (
							<WithActions
								{...props}
								pageContext={pageContext}
								tableRowKey={tableRowKey}
							/>
						)}
					</TableRowKeyContext.Consumer>
				)}
			</PageContext.Consumer>
		);
	}

	return WithActionsWrapper;
}
