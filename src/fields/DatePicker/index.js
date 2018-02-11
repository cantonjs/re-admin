import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'components/Nested';
import Text from 'fields/Text';
import moment from 'moment';
import { isString, isObject, isFunction } from 'lodash';

const buildInDefaultProps = {
	inputFilter(val) {
		if (!val) {
		} else if (isObject(val)) {
			return val;
		} else if (isString(val)) {
			return moment(val);
		}
	},
	outputFilter(val) {
		if (!val) {
		} else if (isFunction(val.toISOString)) {
			return val.toISOString();
		} else if (isString(val)) {
			return val;
		}
	},
};

export default function DatePickerField(props) {
	return (
		<Text
			dataType="date"
			{...buildInDefaultProps}
			{...props}
			component={DatePicker}
		/>
	);
}

/* eslint-disable react/prop-types */
DatePickerField.renderTable = function renderTable({ dateFormat }, { value }) {
	console.log('render table', dateFormat);
	return <span>{moment(new Date(value)).format(dateFormat)}</span>;
};

DatePickerField.propTypes = {
	dateFormat: PropTypes.string,
};

DatePickerField.defaultProps = {
	dateFormat: 'YYYY-MM-DD',
};
