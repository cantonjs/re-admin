
import React from 'react';
import { Table, Text } from '../../src';

export default (
	<Table name="hello" apiPath="test?count=1">
		<Text
			name="id"
			label="ID"
			disabled
			unique
		/>
		<Text
			name="name"
			label="用户名"
			placeholder="请输入用户名"
			validation={[{ type: 'string', max: 10, message: '最多10个字符' }]}
		/>
		<Text
			name="birthday"
			label="生日"
			dataType="date"
		/>
	</Table>
);
