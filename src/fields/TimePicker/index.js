import React from 'react';
import PropTypes from 'prop-types';
import { TimePicker } from 'components/Form';
import field from 'hocs/field';
import moment from 'moment';
import { isString, isObject, isFunction } from 'utils/fp';
import renderDate from 'utils/renderDate';

const buildInDefaultProps = {
	inputFilter(val) {
		if (!val) return;
		if (isObject(val)) return val;
		if (isString(val)) return moment(val);
	},
	outputFilter(val) {
		if (!val) return;
		if (isFunction(val.toISOString)) return val.toISOString();
		if (isString(val)) return val;
	},
};

function TimePickerField(props) {
	return (
		<TimePicker defaultValue={undefined} {...props} {...buildInDefaultProps} />
	);
}

/* eslint-disable react/prop-types */
TimePickerField.renderTable = function renderTable(
	{ format, dateFormat },
	{ value }
) {
	return <span>{renderDate(value, format, dateFormat)}</span>;
};

TimePickerField.propTypes = {
	format: PropTypes.string,
	dateFormat: PropTypes.string,
};

TimePickerField.defaultProps = {
	format: 'time',
};

export default field(TimePickerField);
