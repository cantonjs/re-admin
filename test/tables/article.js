import React from 'react';
import { Table, Text, DatePicker, RangePicker, Html } from '../../src';
import CustomEditorToolbar from '../components/CustomEditorToolbar';

function insertStart() {
	const cursorPosition = this.quill.getSelection().index;
	this.quill.insertText(cursorPosition, '★');
	this.quill.setSelection(cursorPosition + 1);
}

const modules = {
	toolbar: {
		container: '#toolbar',
		handlers: { insertStart },
	},
	clipboard: {
		matchVisual: false,
	},
};

const formats = [
	'header',
	'font',
	'size',
	'bold',
	'italic',
	'underline',
	'strike',
	'blockquote',
	'list',
	'bullet',
	'indent',
	'link',
	'image',
	'color',
];

export default (
	<Table name="article" api={{ pathname: 'test' }}>
		<Text name="id" label="ID" placeholder="ID" disabled unique inQuery />

		<Text name="desc" label="Title" inTable inForm />
		<Html
			name="article"
			label="Article"
			editorProps={{
				fragment: <CustomEditorToolbar />,
				modules,
				formats,
				style: { height: 480 },
			}}
			inForm
		/>

		<DatePicker
			name="createdAt"
			label="Date Created"
			disabled
			inQuery={(props) => <RangePicker {...props} />}
			inTable
			inForm
		/>
	</Table>
);
