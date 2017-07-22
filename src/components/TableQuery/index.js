
import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { Form, Submit, Reset } from 'components/Nested';
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
	clearButton: {
		marginLeft: 8,
	},
};

export default class TableQuery extends Component {
	static propTypes = {
		children: PropTypes.node,
	};

	static childContextTypes = {
		issuer: PropTypes.string,
	};

	getChildContext() {
		return { issuer: QUERIER };
	}

	_handleSearch = (query) => {
		routerStore.location.query = query;
	};

	_handleReset = () => {
		routerStore.location.query = {};
	};

	toggle = () => {
		const { expand } = this.state;
		this.setState({ expand: !expand });
	};

	_saveForm = (form) => {
		if (form) { this._form = form; }
	};

	render() {
		const {
			props: { children },
		} = this;

		if (!Children.count(children)) { return null; }

		return (
			<Form
				ref={this._saveForm}
				style={styles.container}
				onSubmit={this._handleSearch}
				layout="inline"
			>
				<Row style={styles.main}>
					{children}
				</Row>
				<Row>
					<Col span={24} style={styles.footer}>
						<Submit type="primary">查询</Submit>
						<Reset style={styles.clearButton} onClick={this._handleReset}>
							清空
						</Reset>
					</Col>
				</Row>
			</Form>
		);
	}
}
