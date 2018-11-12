import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import EditorContext from 'contexts/Editor';
import withActions from 'hocs/withActions';

@withActions
export default class EditorButton extends Component {
	static propTypes = {
		children: PropTypes.node,
		onClick: PropTypes.func,
		actions: PropTypes.object,
	};

	_handleClick = (ev) => {
		const { onClick, actions } = this.props;
		if (onClick) {
			onClick(ev, actions, this.editorContext);
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
