
import React from 'react';
import { Fields, Text, Select, Option, Image, Actions, Remove, Update } from '../../src';

export default (
	<Fields>
		<Text
			name="id"
			label="ID"
			disabled
			unique
			shouldShowInQuery
			shouldHideInForm
		/>
		<Text
			name="name"
			label="用户名"
			placeholder="请输入用户名"
			validator={[{
				type: 'string',
				required: true,
				max: 10,
				message: '最多10个字符',
			}]}
			shouldShowInQuery
		/>
		<Image
			name="avatar"
			label="头像"
			width={60}
		/>
		<Text
			name="desc"
			label="描述"
			placeholder="请输入描述"
		/>
		<Text
			name="score"
			label="分数"
			max={18}
			validator={[{ required: true, message: '必填' }]}
			shouldHideInTable
		/>
		<Select
			name="fav"
			label="爱好"
		>
			<Option value="1">吃饭</Option>
			<Option value="2">睡觉</Option>
		</Select>
		<Text
			name="gpa"
			label="GPA"
			dataType={Number}
			shouldHideInTable
		/>
		<Text
			name="birthday"
			label="生日"
			dataType={Date}
			shouldHideInTable
		/>
		<Actions>
			<Remove />
			<span className="ant-divider" />
			<Update />
		</Actions>
	</Fields>
);
