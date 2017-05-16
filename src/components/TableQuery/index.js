
import $$ from './style.scss';
import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Button, Icon } from 'antd';
import { QUERIER } from 'constants/Issuers';

@Form.create()
export default class TableQuery extends Component {
	static propTypes = {
		form: PropTypes.object.isRequired,
		children: PropTypes.node,
		onQuery: PropTypes.func.isRequired,
	};

	static childContextTypes = {
		form: PropTypes.object,
		issuer: PropTypes.string,
	};

	getChildContext() {
		const { form } = this.props;
		return { form, issuer: QUERIER };
	}

	_handleSearch = (e) => {
		const { form, onQuery } = this.props;
		e.preventDefault();
		form.validateFields((err, values) => {
			err && __DEV__ && console.error(err);
			onQuery(values, { shouldReplace: true });
		});
	}

	_handleReset = () => {
		const { form, onQuery } = this.props;
		form.resetFields();
		onQuery({}, { shouldReplace: true });
	}

	toggle = () => {
		const { expand } = this.state;
		this.setState({ expand: !expand });
	}

	render() {
		const {
			props: { children },
		} = this;

		if (!Children.count(children)) { return null; }

		return (
			<Form
				className={$$.container}
				onSubmit={this._handleSearch}
				layout="inline"
			>
				<Row gutter={40}>
					{children}
				</Row>
				<Row>
					<Col span={24} className={$$.footer}>
						<Button type="primary" htmlType="submit">
							查询
						</Button>
						<Button className={$$.clearButton} onClick={this._handleReset}>
							清空
						</Button>
					</Col>
				</Row>
			</Form>
		);
	}
}
