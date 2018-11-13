import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TABLE } from 'utils/Issuers';
import withIssuer from 'hocs/withIssuer';
import QueryConnector from 'components/QueryConnector';
import TableView from './TableView';
import TableFooter from './TableFooter';

@withIssuer({ issuer: TABLE })
export default class TableBody extends Component {
	static propTypes = {
		store: PropTypes.object.isRequired,
	};

	render() {
		const { props } = this;
		return (
			<QueryConnector store={props.store}>
				<div>
					<TableView {...props} />
					<TableFooter {...props} />
				</div>
			</QueryConnector>
		);
	}
}
