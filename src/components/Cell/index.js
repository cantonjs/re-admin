
import React, { Component } from 'react';

export default class Cell extends Component {
	static render(Comp = 'div', config, renderText, renderRecord, renderIndex) {
		return (
			<Comp
				{...config}
				renderText={renderText}
				renderRecord={renderRecord}
				renderIndex={renderIndex}
			/>
		);
	}

	render() {
		const { props } = this;
		return (
			<div {...props} />
		);
	}
}
