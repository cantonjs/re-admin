
import React from 'react';
import { RangePicker } from 'components/Nested';
import Text from 'fields/Text';
import moment from 'moment';
import { isString, isObject, isFunction, isUndefined } from 'lodash';

const rangeInputFilter = (range) => range.map((val) => {
	if (isObject(val)) { return val; }
	else if (isString(val)) { return moment(val); }
});

const rangeOutputFilter = (range) => {
	const output = range.map((val) => {
		if (val && isFunction(val.toISOString)) { return val.toISOString(); }
		else if (isString(val)) { return val; }
	}).filter((val) => val).join(',');
	return output;
};

const buildInDefaultProps = {
	inputFilter(value = '') {
		if (isFunction(value.map)) {
			return rangeInputFilter(value);
		}
		else if (isFunction(value.split)) {
			const [v0, v1] = value.split(',');
			return [
				v0 ? moment(v0) : undefined,
				v1 ? moment(v1) : undefined,
			];
		}
		return [undefined, undefined];
	},
	outputFilter(value) {
		if (value && isFunction(value.map)) {
			return rangeOutputFilter(value);
		}
		return value;
	},
};

const shouldIgnoreEmpty = (value, pristineValue) => {
	if (!pristineValue) { return true; }
	if (isFunction(pristineValue.every)) {
		return pristineValue.every((item) => isUndefined(item));
	}
	return true;
};

export default function RangePickerField(props) {
	return (
		<Text
			dataType="date"
			{...buildInDefaultProps}
			{...props}
			shouldIgnoreEmpty={shouldIgnoreEmpty}
			component={RangePicker}
		/>
	);
}
