import createComponent from './createComponent';
import Quill from 'react-quill';

export default createComponent(Quill, {
	displayName: 'Editor',
	getValueFromChangeEvent(value) {
		return value;
	},
});
