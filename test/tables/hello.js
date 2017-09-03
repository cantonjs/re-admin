
import React from 'react';
import { Table, Text, Image } from '../../src';

export default (
	<Table name="hello" api={{ pathname: 'test', query: { count: 1 } }}>
		<Text
			name="id"
			label="ID"
			disabled
			unique
			inQuery
			inForm
			inTable
		/>

		<Image
			name="avatar"
			label="头像"
			width={60}
			inForm
			inTable
		/>
	</Table>
);
