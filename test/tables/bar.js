import React from 'react';
import { Table, Text, Image } from '../../src';

export default (
	<Table name="bar" api={{ pathname: 'bar', query: { count: 2 } }}>
		<Text
			name="id"
			label="ID"
			placeholder="ID"
			disabled
			unique
			// inQuery
			inForm
			inTable
		/>

		<Image name="avatar" label="Avatar" width={60} inForm inTable />
	</Table>
);
