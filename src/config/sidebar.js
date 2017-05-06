export default [
	{
		path: 'index',  // route时url中的值
		name: '菜单一',  // 在菜单中显示的名称
		icon: 'smile',  // 图标是可选的
		children: [
			{
				path: 'option1',
				name: '1-1',
				icon: 'play-circle',   // 二级三级菜单也可以带图标
			},
			{
				path: 'option2',
				name: '1-2',
				icon: 'android',
			},
			{
				path: 'option3',
				name: '1-3',
				icon: 'bulb',
			},
		],
	},
	{
		path: 'alone',
		name: '我没有子菜单',
		icon: 'clock-circle',
		table: 'a'
	},
	{
		path: 'alone2',
		name: '我没有图标',
		table: 'b'
	},
	{
		path: 'noiconhaha',
		name: '又一个没图标的',
		children: [
			{
				path: 'nesnesnes',
				name: 'N64',
			},
		],
	},
	{
		path: 'daohang',
		name: '三级导航',
		icon: 'appstore',
		children: [
			{
				path: '555',
				name: '选项5',
			},
			{
				path: 'sanji',  // 最多只能到三级导航
				name: '三级导航',
				icon: 'laptop',
				children: [
					{
						path: '666',
						name: '选项6',
						icon: 'check',
					},
					{
						path: '777',
						name: '选项7',
						icon: 'close',
					},
					{
						path: '888',
						name: '选项8',
					},
					{
						path: '999',
						name: '选项9',
					},
				],
			},
		],
	},
	{
		path: 'test',
		name: '测试',
		icon: 'eye',
		children: [
			{
				path: 'aaa',
				name: '选项a',
			},
			{
				path: 'bbb',
				name: '选项b',
				icon: 'pause',
			},
			{
				path: 'ccc',
				name: '选项c',
			},
			{
				path: 'sanjiaaa',  // 最多只能到三级导航
				name: '三级导航aaa',
				children: [
					{
						path: '666aa',
						name: '选项6',
						icon: 'meh',
					},
				],
			},
			{
				path: 'sanjibbb',  // 最多只能到三级导航
				name: '三级导航bbb',
				children: [
					{
						path: '666bb',
						name: '选项6',
					},
				],
			},
		],
	},
];
