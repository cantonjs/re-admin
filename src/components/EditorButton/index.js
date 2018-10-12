import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import EditorContext from 'contexts/Editor';

export default class EditorButton extends Component {
	static propTypes = {
		children: PropTypes.node,
		onClick: PropTypes.func,
	};

	_handleClick = (ev) => {
		const { onClick } = this.props;
		if (onClick) {
			onClick(ev, this.editorContext.getEditor());
		}
	};

	_renderChildren = (editorContext) => {
		this.editorContext = editorContext;
		const { children } = this.props;
		return <button onClick={this._handleClick}>{children}</button>;
	};

	render() {
		return (
			<EditorContext.Consumer>{this._renderChildren}</EditorContext.Consumer>
		);
	}
}
