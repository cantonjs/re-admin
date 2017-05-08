
import React from 'react';
import { TextField } from 'components/QueryComponents';

export default function TestQuery() {
	return (
		<div>
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
		</div>
	);
}
