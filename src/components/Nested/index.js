

import { Input as AntdInput, Select as AntdSelect } from 'antd';
import createComponent from './createComponent';

export Form from './Form';
export Submit from './Submit';
export Reset from './Reset';

export const Input = createComponent(AntdInput, {
	displayName: 'NestedInput',
});

export const Select = createComponent(AntdSelect, {
	displayName: 'NestedSelect',
	mapChange(onChange) {
		return (value) => {
			onChange(null, value);
		};
	},
});
