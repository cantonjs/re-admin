import React from 'react';
import { EditorButton } from '../../src';

function insertStart(ev, quill) {
	const cursorPosition = quill.getSelection().index;
	quill.insertText(cursorPosition, '★');
	quill.setSelection(cursorPosition + 1);
}

const CustomEditorButton = () => (
	<EditorButton onClick={insertStart}>
		<span>★</span>
	</EditorButton>
);

export default CustomEditorButton;
