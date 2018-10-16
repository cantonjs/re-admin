import React, { Component } from 'react';
import { TABLE } from 'utils/Issuers';
import withIssuer from 'hocs/withIssuer';
import TableView from './TableView';
import TableFooter from './TableFooter';

@withIssuer({ issuer: TABLE })
export default class TableBody extends Component {
	render() {
		const { props } = this;
		return (
			<div>
				<TableView {...props} />
				<TableFooter {...props} />
			</div>
		);
	}
}
