import React from 'react';

const CustomButton = () => <span>★</span>;

const CustomEditorToolbar = () => (
	<div id="toolbar">
		<select className="ql-header" defaultValue="" onChange={(e) => e.persist()}>
			<option value="1" />
			<option value="2" />
			<option value="" />
		</select>
		<button className="ql-bold" />
		<button className="ql-italic" />
		<select className="ql-color" defaultValue="black">
			<option value="red" />
			<option value="green" />
			<option value="blue" />
			<option value="orange" />
			<option value="violet" />
			<option value="#d0d1d2" />
			<option value="black" />
		</select>
		<button className="ql-insertStart">
			<CustomButton />
		</button>
	</div>
);

export default CustomEditorToolbar;
