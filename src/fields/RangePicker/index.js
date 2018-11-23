import React from 'react';
import { RangePicker } from 'components/Form';
import moment from 'moment';
import field from 'hocs/field';
import { formatHelper } from 'react-form-mobx';
import { isString, isObject, isFunction, isUndefined } from 'utils/fp';

const rangeInputFilter = (range) =>
	range.map((val) => {
		if (isObject(val)) {
			return val;
		} else if (isString(val)) {
			return moment(val);
		}
	});

const rangeOutputFilter = (range) => {
	const output = range
		.map((val) => {
			if (val && isFunction(val.toISOString)) {
				return val.toISOString();
			} else if (isString(val)) {
				return val;
			}
		})
		.filter((val) => val)
		.join(',');
	return output;
};

const formatFunc = function formatFunc(val) {
	return val.filter(Boolean).map((date) => formatHelper.date(date));
};

const buildInDefaultProps = {
	preFormat(val) {
		if (isString(val)) return val.split(',');
		return val;
	},
	inputFilter(value = '') {
		if (isFunction(value.map)) {
			return rangeInputFilter(value);
		} else if (isFunction(value.split)) {
			const [v0, v1] = value.split(',');
			return v0 && v1 ? [moment(v0), moment(v1)] : undefined;
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

const isEmpty = (val) => {
	if (!val) {
		return true;
	}
	if (isFunction(val.every)) {
		return val.every((item) => isUndefined(item));
	}
	return false;
};

// TODO: add should ignore support
const shouldIgnore = (value, pristineValue) =>
	isEmpty(value) && isEmpty(pristineValue);

function RangePickerField(props) {
	return (
		<RangePicker {...buildInDefaultProps} {...props} formatFunc={formatFunc} />
	);
}

export default field(RangePickerField);
