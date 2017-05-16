
import getSchema from 'utils/getSchema';
import jsxToPlainObject from 'utils/jsxToPlainObject';

export default function getDataSchema(table) {
	const { children } = getSchema(table, 'data').props;
	return jsxToPlainObject(children);
}
