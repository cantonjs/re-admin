
import $$ from './style.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class QueryField extends Component {
	static propTypes = {
		className: PropTypes.string,
		containerClassName: PropTypes.string,
		component: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.func,
		]).isRequired,
		title: PropTypes.string.isRequired,
		key: PropTypes.string.isRequired,
	};

	render() {
		const {
			component: Comp,
			containerClassName,
			className,
			title,
			...other,
		} = this.props;
		return (
			<div className={classnames($$.container, containerClassName)}>
				<h1 className={$$.title}>{title} :</h1>
				<Comp className={classnames($$.content, className)} {...other} />
			</div>
		);
	}
}
