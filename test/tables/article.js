import React from 'react';
import { Table, Text, DatePicker, RangePicker, Html } from '../../src';

export default (
	<Table name="article" api={{ pathname: 'test' }}>
		<Text name="id" label="ID" placeholder="ID" disabled unique inQuery />

		<Text name="desc" label="Title" inTable inForm />
		<Html name="article" label="Article" inForm />

		<DatePicker
			name="createdAt"
			label="Date Created"
			disabled
			inQuery={(props) => <RangePicker {...props} />}
			inTable
			inForm
		/>
	</Table>
);
