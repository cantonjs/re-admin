
import { isUndefined, isDate, isString, isNumber, padEnd } from 'lodash';
import { returnsArgument } from 'empty-functions';

const tsToDate = (n) => new Date(+padEnd(n, 13, '0')).toISOString();

const toInt = (data) => parseInt(data, 10) || 0;
const toNumber = (data) => +data || 0;
const toString = (data) => data ? (data + '') : data;
const toBoolean = (data) => !!data;

const toDateTime = (data) => {
	if (!data) { return ''; }

	if (isString(data) && data.includes(',')) {
		return data.split(',').map(toDateTime);
	}
	else if (Array.isArray(data)) {
		return data.map(toDateTime);
	}

	if (isDate(data)) { return data.toISOString(); }
	else if (isNumber(data)) { return tsToDate(data); }
	else if (isString(data)) {
		if (/^\d*$/.test(data)) { return tsToDate(data); }
		return new Date(data).toISOString();
	}
	console.error(`${data} is NOT a valid dateTime type`);
	return data;
};

const toDate = (data) => {
	if (!data) { return ''; }

	if (isString(data) && data.includes(',')) {
		return data.split(',').map(toDate);
	}
	else if (Array.isArray(data)) {
		return data.map(toDate);
	}

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
	any: returnsArgument,
};

export const dataTypes = Object.keys(Types);

export function parseDataType(data, type) {
	if (isUndefined(data)) { return; }
	return isString(type) ? Types[type](data) : type(data);
}
