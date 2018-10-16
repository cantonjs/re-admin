import React from 'react';
import {
	Table,
	Text,
	DatePicker,
	RangePicker,
	Html,
	EditorToolbar,
} from '../../src';
import CustomEditorButton from '../components/CustomEditorButton';

const modules = {
	clipboard: {
		matchVisual: false,
	},
};

export default (
	<Table name="article" useCursor>
		<Text name="id" label="ID" placeholder="ID" disabled unique inQuery />

		<Text name="desc" label="Title" inTable inForm />
		<Html
			name="article"
			label="Article"
			editorProps={{
				toolbar: (
					<EditorToolbar>
						<CustomEditorButton />
					</EditorToolbar>
				),
				modules,
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
