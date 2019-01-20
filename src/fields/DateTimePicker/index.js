import React from 'react';
import PropTypes from 'prop-types';
import { DateTimePicker } from 'components/Form';
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

function DateTimePickerField(props) {
	return (
		<DateTimePicker
			defaultValue={undefined}
			{...props}
			{...buildInDefaultProps}
		/>
	);
}

/* eslint-disable react/prop-types */
DateTimePickerField.renderTable = function renderTable(
	{ format, dateFormat },
	{ value }
) {
	return <span>{renderDate(value, format, dateFormat)}</span>;
};

DateTimePickerField.propTypes = {
	format: PropTypes.string,
	dateFormat: PropTypes.string,
};

DateTimePickerField.defaultProps = {
	format: 'dateTime',
};

export default field(DateTimePickerField);
