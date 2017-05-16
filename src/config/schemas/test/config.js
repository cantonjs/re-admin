
import { Text, Select, Option, Image } from 'Schemas';

export default {
	data: [
		{
			component: Text,
			name: 'id',
			label: 'ID',
			disabled: true,
			unique: true,
		},
		{
			component: Text,
			name: 'name',
			label: '用户名',
			placeholder: '请输入用户名',
			validator: [{ type: 'string', max: 10, message: '最多10个字符' }],
		},
		{
			component: Image,
			name: 'avatar',
			label: '头像',
			width: 60,
		},
		{
			component: Text,
			name: 'desc',
			label: '描述',
			placeholder: '请输入描述',
		},
		{
			component: Text,
			name: 'score',
			label: '分数',
			max: 18,
			validator: [{ required: true, message: '必填' }],
		},
		{
			component: Select,
			name: 'fav',
			label: '爱好',
			children: [
				{ component: Option, value: '1', children: '吃饭' },
				{ component: Option, value: '2', children: '睡觉' },
			],
		},
		{
			component: Text,
			name: 'gpa',
			label: 'GPA',
			dataType: Number,
			shouldHideInTable: true,
		},
		{
			component: Text,
			name: 'birthday',
			label: '生日',
			dataType: Date,
		},
	],
	query: [
		{
			component: Text,
			name: 'name',
			label: '用户名',
			placeholder: '请输入用户名',
		},
	],
};
