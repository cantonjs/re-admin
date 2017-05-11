
import React from 'react';
import { Fields, Text, Image } from 'Schemas';

export default (
	<Fields>
		<Text
			name="id"
			label="ID"
			unique
		/>
		<Text
			name="name"
			label="用户名"
			placeholder="请输入用户名"
			validator={[{ type: 'string', max: 10, message: '最多10个字符' }]}
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
		/>
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
		/>
	</Fields>
);

// module.exports = [
// 	{
// 		key: 'id',
// 		title: 'ID',
// 		dataType: 'int',
// 		unique: true,
// 	},
// 	{
// 		key: 'name',
// 		title: '姓名',
// 		dataType: 'varchar',
// 		validator: [{type: 'string', max: 10, message: '最多10个字符'}],
// 	},
// 	{
// 		key: 'touxiang',
// 		title: '头像',
// 		dataType: 'varchar',
// 		showType: 'image',
// 		width: 60,
// 	},
// 	{
// 		key: 'desc',
// 		title: '描述',
// 		dataType: 'varchar',
// 	},
// 	{
// 		key: 'score',
// 		title: '分数',
// 		dataType: 'int',
// 		max: 18,
// 		validator: [{required: true, message: '必填'}],
// 	},
// 	{
// 		key: 'gpa',
// 		title: 'GPA',
// 		dataType: 'float',
// 	},
// 	{
// 		key: 'birthday',
// 		title: '生日',
// 		dataType: 'datetime',
// 	},
// 	// 定义针对单条记录的操作
// 	// 常见的针对单条记录的自定义操作有哪些? 无非是更新和删除
// 	// 注意, 如果没有定义主键, 是不允许更新和删除的
// 	{
// 		// 这个key是我预先定义好的, 注意不要冲突
// 		key: 'singleRecordActions',
// 		title: '我是自定义操作',	// 列名
// 		width: 300,	// 宽度
// 		actions: [
// 			{
// 				title: '更新姓名',
// 				type: 'update',	// 更新单条记录
// 				keys: ['name'],	// 允许更新哪些字段, 如果不设置keys, 就允许更所有字段
// 			},
// 			{
// 				title: '更新分数和GPA',
// 				type: 'update',
// 				keys: ['score', 'gpa'],	// 弹出的modal中只会有这两个字段
// 			},
// 			{
// 				title: '更新生日',
// 				type: 'update',
// 				keys: ['birthday'],
// 				visible: (record) => record.id >= 1010,	// 所有action都可以定义visible函数, 返回false则对这行记录不显示这个操作
// 			},
// 			{
// 				title: '更新头像',
// 				type: 'update',
// 				keys: ['touxiang'],
// 			},
// 			{
// 				type: 'newLine',	// 换行, 纯粹用于排版的, 更美观一点
// 			},
// 			{
// 				type: 'newLine',
// 			},
// 			{
// 				title: '删除',
// 				type: 'delete',	// 删除单条记录
// 			},
// 			{
// 				title: '自定义组件-更新gpa',
// 				type: 'component',
// 			},
// 			{
// 				title: '自定义组件2号',
// 				type: 'component',
// 			},
// 		],
// 	},
// ];
