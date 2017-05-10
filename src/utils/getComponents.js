
import getSchema from 'utils/getSchema';

export default function getComponents(table) {
	return {
		dataNodes: getSchema(table, 'data').props.children,
		queryNodes: getSchema(table, 'query').props.children,
		ToolbarComponent: getSchema(table, 'toolbar'),
	};
}
