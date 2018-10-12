import React from 'react';
import PropTypes from 'utils/PropTypes';

const EditorToolbar = (props) => (
	<div className="editor-toolbar">
		{props.font && <select className="ql-font" />}
		{props.size && <select className="ql-size" />}
		{props.bold && <button className="ql-bold" />}
		{props.italic && <button className="ql-italic" />}
		{props.underline && <button className="ql-underline" />}
		{props.strike && <button className="ql-strike" />}
		{props.color && <select className="ql-color" />}
		{props.background && <select className="ql-background" />}
		{props.script && <button className="ql-script" value="sub" />}
		{props.script && <button className="ql-script" value="super" />}
		{props.header && <button className="ql-header" value="1" />}
		{props.header && <button className="ql-header" value="2" />}
		{props.blockquote && <button className="ql-blockquote" />}
		{props.codeBlock && <button className="ql-code-block" />}
		{props.list && <button className="ql-list" value="ordered" />}
		{props.list && <button className="ql-list" value="bullet" />}
		{props.indent && <button className="ql-indent" value="-1" />}
		{props.indent && <button className="ql-indent" value="+1" />}
		{props.direction && <button className="ql-direction" value="rtl" />}
		{props.align && <select className="ql-align" />}
		{props.link && <button className="ql-link" />}
		{props.image && <button className="ql-image" />}
		{props.video && <button className="ql-video" />}
		{props.formula && <button className="ql-formula" />}
		{props.clean && <button className="ql-clean" />}
		{props.children}
	</div>
);

EditorToolbar.propTypes = {
	children: PropTypes.node,
	font: PropTypes.bool,
	size: PropTypes.bool,
	bold: PropTypes.bool,
	italic: PropTypes.bool,
	underline: PropTypes.bool,
	strike: PropTypes.bool,
	color: PropTypes.bool,
	background: PropTypes.bool,
	script: PropTypes.bool,
	header: PropTypes.bool,
	blockquote: PropTypes.bool,
	codeBlock: PropTypes.bool,
	list: PropTypes.bool,
	indent: PropTypes.bool,
	direction: PropTypes.bool,
	align: PropTypes.bool,
	link: PropTypes.bool,
	image: PropTypes.bool,
	video: PropTypes.bool,
	formula: PropTypes.bool,
	clean: PropTypes.bool,
};

EditorToolbar.defaultProps = {
	font: false,
	size: true,
	bold: true,
	italic: true,
	underline: true,
	strike: true,
	color: true,
	background: true,
	script: false,
	header: true,
	blockquote: true,
	codeBlock: true,
	list: true,
	indent: true,
	direction: false,
	align: true,
	link: true,
	image: true,
	video: true,
	formula: false,
	clean: true,
};

export default EditorToolbar;
