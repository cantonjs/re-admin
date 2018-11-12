import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Actions from './Actions';
import invariant from 'tiny-invariant';
import hoist, { extractRef } from 'hocs/hoist';
import withModalStore from 'hocs/withModalStore';
import withStore from 'hocs/withStore';
import withIssuer from 'hocs/withIssuer';
import PageContext from 'contexts/PageContext';
import TableRowKeyContext from 'contexts/TableRowKey';

// Notice that this `Action` is NOT Redux or MobX action.
export default function withActions(WrappedComponent) {
	@hoist(WrappedComponent)
	@withIssuer()
	@withStore()
	@withModalStore()
	@observer
	class WithActions extends Component {
		static propTypes = {
			modalStore: PropTypes.object.isRequired,
			store: PropTypes.object.isRequired,
			issuers: PropTypes.instanceOf(Set).isRequired,
			pageContext: PropTypes.object.isRequired,
			tableRowKey: PropTypes.string,
			enforceModal: PropTypes.bool,
		};

		static defaultProps = {
			enforceModal: false,
		};

		actions = new Actions(this);

		render() {
			const {
				props: {
					modalStore,
					store,
					pageContext,
					tableRowKey,
					enforceModal,
					...props
				},
				actions,
			} = this;
			return <WrappedComponent {...extractRef(props)} actions={actions} />;
		}
	}

	function WithActionsWrapper(props) {
		return (
			<PageContext.Consumer>
				{(pageContext) => {
					invariant(
						pageContext,
						'You should not use `withActions` outside <EnhancedRoute>'
					);
					return (
						<TableRowKeyContext.Consumer>
							{(tableRowKey) => (
								<WithActions
									{...props}
									pageContext={pageContext}
									tableRowKey={tableRowKey}
								/>
							)}
						</TableRowKeyContext.Consumer>
					);
				}}
			</PageContext.Consumer>
		);
	}

	return WithActionsWrapper;
}
