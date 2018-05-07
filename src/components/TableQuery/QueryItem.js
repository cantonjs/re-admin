import { Component, Children } from 'react';
import PropTypes from 'prop-types';

export default class QueryItem extends Component {
	static propTypes = {
		children: PropTypes.node.isRequired,
	};

	static contextTypes = {
		store: PropTypes.object.isRequired,
	};

	componentDidMount() {
		this.context.store.increaseQueryFieldsCount();
	}

	componentWillUnmount() {
		this.context.store.decreaseQueryFieldsCount();
	}

	render() {
		return Children.only(this.props.children);
	}
}
