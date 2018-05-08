import { isFunction } from 'lodash';

export default function parseColumn(column) {
	const { title, body, ...other } = column;
	const res = other;

	res.title = isFunction(title) ? title() : title;

	// inject props into `components/TableBody/TableHeadCell` component
	res.onHeaderCell = (column) => column.headers;

	if (body) {
		res.render = function renderTable(value, record, index) {
			// inject props into `components/TableBody/TableCell` component
			return { props: body({ value, record, index }) };
		};
	}

	return res;
}
