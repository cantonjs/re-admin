
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import routerStore from 'stores/routerStore';
import { QUERIER } from 'constants/Issuers';
import { Row, Col } from 'antd';
import { Form, Submit, Reset } from 'components/Nested';
import ClearSortButton from 'components/ClearSortButton';
import FormItemWrapper from 'components/FormItemWrapper';

class FormState {
	@observable data = {};
}

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
		store: PropTypes.object,
		routerStore: PropTypes.object,
	};

	static defaultProps = {
		routerStore,
	};

	static childContextTypes = {
		issuer: PropTypes.string,
		formState: PropTypes.object,
	};

	getChildContext() {
		return {
			issuer: QUERIER,
			formState: this._formState,
		};
	}

	componentWillMount() {
		this._formState = new FormState();
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

	_handleChange = (data) => {
		this._formState.data = data;
	};

	render() {
		const {
			store: { hasSortableField, hasQueryField, queryRenderers },
		} = this.props;

		if (!hasSortableField && !hasQueryField) { return null; }

		return (
			<Form
				ref={this._saveForm}
				style={styles.container}
				onSubmit={this._handleSearch}
				onChange={this._handleChange}
				layout="inline"
			>
				{queryRenderers.length > 0 &&
					<Row style={styles.main}>
						{queryRenderers.map((renderOptions, index) =>
							<FormItemWrapper renderOptions={renderOptions} key={index} />
						)}
					</Row>
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
