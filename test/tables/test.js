
import React from 'react';
import {
	Table, Text, Select, Option, Image, Slider, Uploader,
	RangePicker, DatePicker, Ref,
	ArrayOf, ObjectOf,
	Actions, CreateButton, RemoveButton, UpdateButton, RefButton,
} from '../../src';

export default (
	<Table
		name="test"
		extend={{
			customMethod(requestOptions) {
				console.log(requestOptions);
			},
		}}
	>
		<Text
			name="id"
			label="ID"
			disabled
			unique
			inQuery
		/>

		<Text
			name="name"
			label="用户名"
			placeholder="请输入用户名"
			maxLength={10}
			required
			inQuery
			inTable
			inForm
		/>

		<Ref
			name="ref"
			table="foo"
			placeholder="请输入超链表"
			label="超链表"
			// noModalQuery
			inForm
			inQuery
		/>

		<DatePicker
			name="createdAt"
			dataType="date"
			label="创建日期"
			disabled
			inQuery={(props) => <RangePicker {...props} />}
			inTable
			inForm
		/>

		<Image
			name="avatar"
			label="头像"
			width={60}
			inTable
			inForm
		/>

		<Text
			name="desc"
			label="描述"
			placeholder="请输入描述"
			inTable
			inForm
		/>

		<ObjectOf
			name="pet"
			label="宠物"
			inForm
		>
			<Text
				name="name"
				label="宠物名字"
				placeholder="请输入宠物名字"
			/>
			<Text
				name="type"
				label="宠物物种"
				placeholder="请输入宠物物种"
			/>
			<ArrayOf name="languages" label="语言">
				<ObjectOf>
					<Text
						name="name"
						label="语言名称"
						placeholder="请输入语言名称"
					/>
					<Text
						name="score"
						label="语言成绩"
						placeholder="请输入语言成绩"
					/>
				</ObjectOf>
			</ArrayOf>
		</ObjectOf>

		<ArrayOf
			name="tags"
			label="标签"
			inTable
			inForm
		>
			<Text
				placeholder="请输入标签"
			/>
		</ArrayOf>

		<Text
			name="fee"
			label="薪酬"
			required
			inputFilter={(value) => /^\$/.test(value) ? value : ('$' + (value / 100).toFixed(2))}
			outputFilter={(value) => value.slice(1) * 100}
			inTable
			inForm
		/>

		<Text
			name="num"
			label="Number"
			dataType="integer"
			value={32}
			sortable
			inQuery={{ value: 33 }}
			inTable
			inForm
		/>

		<Uploader
			name="file"
			label="文件"
			inForm
		/>

		<Select
			name="fav"
			label="爱好"
			inForm
			value="2"
		>
			<Option value="1">吃饭</Option>
			<Option value="2">睡觉</Option>
		</Select>

		<Slider
			name="gpa"
			label="GPA"
			dataType="integer"
			inForm={(props, { Component, getData }) =>
				getData().fav > 1 ? (<Component {...props} />) : null
			}
		/>
		<Text
			name="birthday"
			label="生日"
			dataType="date"
			inForm
		/>

		<Actions>
			<CreateButton table="foo" label="新建foo" />
			<RemoveButton />
			<UpdateButton names={['name', 'avatar']} />
			<RefButton table="foo" noQuery />
		</Actions>
	</Table>
);
