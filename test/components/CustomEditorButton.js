import React from 'react';
import { EditorButton } from '../../src';

function insertStart(ev, actions, editorContext) {
	const quill = editorContext.getEditor();
	const cursorPosition = quill.getSelection(true).index;
	quill.insertText(cursorPosition, '★');
	quill.setSelection(cursorPosition + 1);
}

const CustomEditorButton = () => (
	<EditorButton onClick={insertStart}>
		<span>★</span>
	</EditorButton>
);

export default CustomEditorButton;
