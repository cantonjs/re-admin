import $$ from './style.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Button, Icon } from 'antd';
import QueryField from 'components/QueryField';

@Form.create()
export default class TableQuery extends Component {
	static propTypes = {
		form: PropTypes.object.isRequired,
	};

	static childContextTypes = {
		form: PropTypes.object,
	};

	getChildContext() {
		const { form } = this.props;
		return { form };
	}

	state = {
		expand: false,
	};

	handleSearch = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			console.log('Received values of form: ', values);
		});
	}

	handleReset = () => {
		this.props.form.resetFields();
	}

	toggle = () => {
		const { expand } = this.state;
		this.setState({ expand: !expand });
	}

	render() {
		const expand = this.state.expand;
		return (
			<Form
				className={$$.container}
				onSubmit={this.handleSearch}
			>
				<Row gutter={40}>
					<QueryField label="fork" name="shit" />
				</Row>
				<Row>
					<Col span={24} style={{ textAlign: 'right' }}>
						<Button type="primary" htmlType="submit">Search</Button>
						<Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
							Clear
						</Button>
						<a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
							Collapse <Icon type={expand ? 'up' : 'down'} />
						</a>
					</Col>
				</Row>
			</Form>
		);
	}
}