
import React from 'react';
import { Fields, Text, Select, Option, Image, ArrayOf, Actions, Remove, Update } from '../../src';

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
			// validations={[{
			// 	type: 'string',
			// 	required: true,
			// 	max: 10,
			// 	message: '最多10个字符',
			// }]}
			required
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


		<ArrayOf
			name="tags"
			label="标签"
		>
			<Text
				placeholder="请输入标签"
			/>
		</ArrayOf>


		<Text
			name="score"
			label="分数"
			max={18}
			required
			// validations={[{ required: true, message: '必填' }]}
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
			<Update names={['name', 'avatar']} />
		</Actions>
	</Fields>
);
