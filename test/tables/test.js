
import React from 'react';
import {
	Fields, Text, Select, Option, Image, Slider, RangePicker, DatePicker,
	ArrayOf, ObjectOf,
	Actions, Remove, Update,
} from '../../src';

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
			maxLength={10}
			required
			shouldShowInQuery
		/>

		<DatePicker
			name="createdAt"
			dataType="date"
			label="创建日期"
			disabled
			shouldShowInQuery
			queryComponent={RangePicker}
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


		<ObjectOf
			name="pet"
			label="宠物"
			shouldHideInTable
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
		/>
		<Text
			name="num"
			label="Number"
			dataType="integer"
			shouldShowInQuery
		/>
		<Select
			name="fav"
			label="爱好"
		>
			<Option value="1">吃饭</Option>
			<Option value="2">睡觉</Option>
		</Select>
		<Slider
			name="gpa"
			label="GPA"
			dataType="integer"
			shouldHideInTable
		/>
		<Text
			name="birthday"
			label="生日"
			dataType="date"
			shouldHideInTable
		/>

		<Actions>
			<Remove />
			<Update names={['name', 'avatar']} />
		</Actions>
	</Fields>
);
