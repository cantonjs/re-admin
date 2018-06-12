import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import { Input } from 'components/Form';
import field from 'hocs/field';

@field
export default class TextField extends Component {
	static propTypes = {
		component: PropTypes.component,
	};

	static defaultProps = {
		component: Input,
	};

	render() {
		const { props: { component: Comp, ...other } } = this;
		return <Comp {...other} />;
	}
}
