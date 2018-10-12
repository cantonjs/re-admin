import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import createComponent from './createComponent';
import EditorContext from 'contexts/Editor';
import Quill from 'react-quill';
import EditorToolbar from 'components/EditorToolbar';

class QuillEditorEnhancer extends Component {
	static propTypes = {
		toolbar: PropTypes.node,
		modules: PropTypes.object,
		innerRef: PropTypes.func,
	};

	static defaultProps = {
		modules: {},
		toolbar: <EditorToolbar />,
	};

	constructor(props) {
		super(props);

		const { modules } = props;
		modules.toolbar = {
			container: '.editor-toolbar',
			...modules.toolbar,
		};
		this.modules = modules;
		this.reactQuillRef = { getEditor: () => null };
		this.editorContext = { getEditor: () => this.reactQuillRef.getEditor() };
	}

	saveRef = (ref) => {
		const { innerRef } = this.props;
		this.reactQuillRef = ref;
		if (innerRef) innerRef(ref);
	};

	render() {
		const {
			props: { toolbar, innerRef, ...other },
			modules,
			editorContext,
		} = this;
		return (
			<EditorContext.Provider value={editorContext}>
				<div>
					{toolbar}
					<Quill {...other} modules={modules} ref={this.saveRef} />
				</div>
			</EditorContext.Provider>
		);
	}
}

export default createComponent(QuillEditorEnhancer, {
	displayName: 'Editor',
	getValueFromChangeEvent(value) {
		return value;
	},
});
