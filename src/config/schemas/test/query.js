
import React from 'react';
import Fields, { TextField } from 'components/Fields';

export default function TestQuery() {
	return (
		<Fields>
			<TextField
				name="name"
				label="用户名"
				placeholder="请输入用户名"
			/>
			<TextField
				name="blog"
				label="博客地址"
				placeholder="请输入网址"
			/>
		</Fields>
	);
}
