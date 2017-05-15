
import getSchema from 'utils/getSchema';
import jsxToPlainObject from 'utils/jsxToPlainObject';
import { getComponents } from 'utils/getComponent';

export default function getDataSchema(table) {
	const { children } = getSchema(table, 'data').props;
	return jsxToPlainObject(getComponents(children));
}
