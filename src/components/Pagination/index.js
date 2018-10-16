import React, { Component } from 'react';
import { Pagination as AntdPagination } from 'antd';
import PropTypes from 'utils/PropTypes';
import CursorIndicator from './CursorIndicator';

export default class Pagination extends Component {
	static propTypes = {
		store: PropTypes.object.isRequired,
	};

	render() {
		const { props: { store, ...other } } = this;
		if (store.useCursor) {
			return <CursorIndicator {...other} store={store} />;
		}
		return <AntdPagination {...other} />;
	}
}
