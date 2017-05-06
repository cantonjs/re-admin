export default [
	{
		key: 'index',  // route时url中的值
		name: '菜单一',  // 在菜单中显示的名称
		icon: 'smile',  // 图标是可选的
		child: [
			{
				key: 'option1',
				name: '1-1',
				icon: 'play-circle',   // 二级三级菜单也可以带图标
			},
			{
				key: 'option2',
				name: '1-2',
				icon: 'android',
			},
			{
				key: 'option3',
				name: '1-3',
				icon: 'bulb',
			},
		],
	},
	{
		key: 'alone',
		name: '我没有子菜单',
		icon: 'clock-circle',
		table: 'a'
	},
	{
		key: 'alone2',
		name: '我没有图标',
		table: 'b'
	},
	{
		key: 'noiconhaha',
		name: '又一个没图标的',
		child: [
			{
				key: 'nesnesnes',
				name: 'N64',
			},
		],
	},
	{
		key: 'daohang',
		name: '三级导航',
		icon: 'appstore',
		child: [
			{
				key: '555',
				name: '选项5',
			},
			{
				key: 'sanji',  // 最多只能到三级导航
				name: '三级导航',
				icon: 'laptop',
				child: [
					{
						key: '666',
						name: '选项6',
						icon: 'check',
					},
					{
						key: '777',
						name: '选项7',
						icon: 'close',
					},
					{
						key: '888',
						name: '选项8',
					},
					{
						key: '999',
						name: '选项9',
					},
				],
			},
		],
	},
	{
		key: 'test',
		name: '测试',
		icon: 'eye',
		child: [
			{
				key: 'aaa',
				name: '选项a',
			},
			{
				key: 'bbb',
				name: '选项b',
				icon: 'pause',
			},
			{
				key: 'ccc',
				name: '选项c',
			},
			{
				key: 'sanjiaaa',  // 最多只能到三级导航
				name: '三级导航aaa',
				child: [
					{
						key: '666aa',
						name: '选项6',
						icon: 'meh',
					},
				],
			},
			{
				key: 'sanjibbb',  // 最多只能到三级导航
				name: '三级导航bbb',
				child: [
					{
						key: '666bb',
						name: '选项6',
					},
				],
			},
		],
	},
];
