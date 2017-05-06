
import sidebarConfig from 'config/sidebar';
import Table from 'containers/Table';

export default function readFromSidebar() {
	console.log('sidebarConfig', sidebarConfig);
	return [
		{
			path: 'demo',
			table: 'fork',
			children: [
				{
					path: 'hello',
					table: 'fork',
					component: Table,
				}
			],
		},
	];
}
