import { Component } from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'lodash';

export default class QueryConnector extends Component {
	static propTypes = {
		store: PropTypes.object,
		children: PropTypes.node,
	};

	constructor(props) {
		super(props);

		const { store } = props;
		if (store) {
			this._disposer = store.observeQuery(({ newValue }) => {
				store.fetch({ query: newValue });
				if (isFunction(store.clearSelectedKeys)) store.clearSelectedKeys();
			});
			if (store.router) store.query = store.router.location.query;
		}
	}

	componentWillUnmount() {
		this._disposer && this._disposer();
	}

	render() {
		return this.props.children;
	}
}
