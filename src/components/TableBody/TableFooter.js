import React, { Component } from 'react';
import { Pagination } from 'antd';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import localize from 'hocs/localize';

const styles = {
	footer: {
		overflow: 'hidden',
	},
	total: {
		marginTop: 28,
		float: 'left',
		color: '#888',
	},
	pagination: {
		marginTop: 20,
		float: 'right',
		textAlign: 'right',
	},
};

@localize('TableBody')
@observer
export default class TableFooter extends Component {
	static propTypes = {
		localeStore: PropTypes.object.isRequired,
		store: PropTypes.shape({
			total: PropTypes.number.isRequired,
			size: PropTypes.number.isRequired,
			query: PropTypes.object.isRequired,
		}),
	};

	_handlePageChange = (page) => {
		const { store } = this.props;
		store.setQuery({ ...store.query, page });
	};

	render() {
		const { props: { store, localeStore } } = this;
		const { total, size, query } = store;
		const current = +query.page || 1;
		return (
			<div style={styles.footer}>
				<p style={styles.total}>
					{localeStore.data.total}: {total || 0}
				</p>

				<Pagination
					style={styles.pagination}
					current={current}
					total={total}
					pageSize={size}
					onChange={this._handlePageChange}
				/>
			</div>
		);
	}
}
