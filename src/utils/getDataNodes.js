
import getSchema from 'utils/getSchema';
import { getComponents } from 'utils/getComponent';

const defaultQueryNodes = { props: {} };

export default function getDataNodes(table) {
	return {
		dataNodes: getComponents(
			getSchema(table, 'data').props.children
		),
		queryNodes: getComponents(
			getSchema(table, 'query', defaultQueryNodes).props.children
		),
		toolbarNodes: getSchema(table, 'toolbar', {}),
	};
}
