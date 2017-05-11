
import React from 'react';
import { Fields, Text } from 'Schemas';

export default (
	<Fields>
		<Text
			name="name"
			label="用户名"
			placeholder="请输入用户名"
		/>
		<Text
			name="blog"
			label="博客地址"
			placeholder="请输入网址"
		/>
	</Fields>
);
