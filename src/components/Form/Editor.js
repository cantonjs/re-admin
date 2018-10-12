import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import createComponent from './createComponent';
import EditorContext from 'contexts/Editor';
import Quill from 'react-quill';
import EditorToolbar from 'components/EditorToolbar';

const formats = [
	'align',
	'background',
	'blockquote',
	'bold',
	'code-block',
	'color',
	'direction',
	'font',
	'header',
	'image',
	'indent',
	'italic',
	'link',
	'list',
	'script',
	'size',
	'strike',
	'underline',
	'video',
];

class QuillEditorEnhancer extends Component {
	static propTypes = {
		toolbar: PropTypes.node,
		modules: PropTypes.object,
		formats: PropTypes.array,
		transformFormats: PropTypes.func,
		innerRef: PropTypes.func,
	};

	static defaultProps = {
		modules: {},
		toolbar: <EditorToolbar />,
		formats,
	};

	static defaultFormats = formats;

	constructor(props) {
		super(props);

		const { modules, formats, transformFormats } = props;
		modules.toolbar = {
			container: '.editor-toolbar',
			...modules.toolbar,
		};
		this.formats = transformFormats ? transformFormats(formats) : formats;
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
			props: { toolbar, innerRef, transformFormats, ...other },
			modules,
			formats,
			editorContext,
		} = this;
		return (
			<EditorContext.Provider value={editorContext}>
				<div>
					{toolbar}
					<Quill
						{...other}
						modules={modules}
						formats={formats}
						ref={this.saveRef}
					/>
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
