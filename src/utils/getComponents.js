
import getSchema from 'utils/getSchema';

export default function getComponents(table) {
	return {
		DataComponent: getSchema(table, 'data'),
		QueryComponent: getSchema(table, 'query'),
		ToolbarComponent: getSchema(table, 'toolbar'),
	};
}
