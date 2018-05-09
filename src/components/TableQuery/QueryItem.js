import { Component, Children } from 'react';
import PropTypes from 'prop-types';
import withStore from 'hocs/withStore';

@withStore()
export default class QueryItem extends Component {
	static propTypes = {
		children: PropTypes.node.isRequired,
		store: PropTypes.object.isRequired,
	};

	componentDidMount() {
		this.props.store.increaseQueryFieldsCount();
	}

	componentWillUnmount() {
		this.props.store.decreaseQueryFieldsCount();
	}

	render() {
		return Children.only(this.props.children);
	}
}
