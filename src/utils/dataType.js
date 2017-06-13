
import { isUndefined, isDate, isString, isNumber, padEnd } from 'lodash';

const tsToDate = (n) => new Date(+padEnd(n, 13, '0')).toISOString();

const toInt = (data) => parseInt(data, 10) || 0;
const toNumber = (data) => +data || 0;
const toString = (data) => data ? (data + '') : data;
const toBoolean = (data) => !!data;
const toDateTime = (data) => {
	if (!data) { return ''; }
	else if (isDate(data)) { return data.toISOString(); }
	else if (isNumber(data)) { return tsToDate(data); }
	else if (isString(data)) {
		if (/^\d*$/.test(data)) { return tsToDate(data); }
		return new Date(data).toISOString();
	}
	console.error(`${data} is NOT a valid date type`);
	return data;
};
const toDate = (data) => {
	if (!data) { return ''; }
	const dateTime = toDateTime(data);
	if (isString(dateTime)) {
		const [date] = dateTime.split('T');
		if (!date) { console.error(`${data} is NOT a valid date type`); }
		return date;
	}
	return data;
};

const Types = {
	integer: toInt,
	long: toInt,
	float: toNumber,
	double: toNumber,
	string: toString,
	boolean: toBoolean,
	date: toDate,
	dateTime: toDateTime,
	password: toString,
};

export const dataTypes = Object.keys(Types);

export function parseDataType(data, type) {
	if (isUndefined(data)) { return; }
	return isString(type) ? Types[type](data) : type(data);
}
