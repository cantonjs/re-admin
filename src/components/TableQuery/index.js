
import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { Form, Submit, Reset } from 'components/Nested';
import ClearSortButton from 'components/ClearSortButton';
import routerStore from 'stores/routerStore';

import { QUERIER } from 'constants/Issuers';

const styles = {
	container: {
		padding: 20,
		border: '1px solid #eee',
		margin: '20px 0',
	},
	main: {
		padding: '0 20px',
	},
	footer: {
		textAlign: 'right',
	},
};

export default class TableQuery extends Component {
	static propTypes = {
		children: PropTypes.node,
		store: PropTypes.object,
		routerStore: PropTypes.object,
	};

	static defaultProps = {
		routerStore,
	};

	static childContextTypes = {
		issuer: PropTypes.string,
	};

	getChildContext() {
		return { issuer: QUERIER };
	}

	_handleSearch = (query) => {
		this.props.routerStore.location.query = query;
	};

	_handleReset = () => {
		this.props.routerStore.location.query = {};
	};

	_saveForm = (form) => {
		if (form) { this._form = form; }
	};

	render() {
		const {
			props: { children, store: { hasSortableField, hasQueryField } },
		} = this;

		if (!hasSortableField && !hasQueryField) { return null; }

		return (
			<Form
				ref={this._saveForm}
				style={styles.container}
				onSubmit={this._handleSearch}
				layout="inline"
			>
				{Children.count(children) > 0 &&
					<Row style={styles.main}>{children}</Row>
				}
				<Row>
					<Col span={24} style={styles.footer}>
						{hasQueryField && <Submit type="primary">查询</Submit>}
						{hasQueryField && <Reset onClick={this._handleReset}>重置</Reset>}
						<ClearSortButton />
					</Col>
				</Row>
			</Form>
		);
	}
}
