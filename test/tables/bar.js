import React from 'react';
import { Table, Text, Image, Html } from '../../src';

export default (
	<Table
		name="bar"
		api={{ pathname: 'bar', query: { count: 2 } }}
		extend={{
			customMethod(requestOptions) {
				console.log(requestOptions);
				return requestOptions.refStore.getData().desc;
			},
			getAvatar({ refStore }) {
				return refStore.getData().avatar;
			},
		}}
	>
		<Text
			name="id"
			label="ID"
			placeholder="ID"
			disabled
			unique
			inQuery
			inForm
			inTable
		/>

		<Html name="article" label="Article" inQuery inTable inForm />

		<Image name="avatar" label="Avatar" width={60} inForm inTable />
	</Table>
);
