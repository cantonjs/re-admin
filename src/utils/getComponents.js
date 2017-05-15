
import getSchema from 'utils/getSchema';

const defaultQueryNodes = { props: {} };

export default function getComponents(table) {
	return {
		dataNodes: getSchema(table, 'data').props.children,
		queryNodes: getSchema(table, 'query', defaultQueryNodes).props.children,
		toolbarNodes: getSchema(table, 'toolbar', {}),
	};
}
