
import $$ from './style.scss';
import React, { Component } from 'react';
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

	state = {
		expand: false,
	};

	handleSearch = (e) => {
		const { form, onQuery } = this.props;
		e.preventDefault();
		form.validateFields((err, values) => {
			err && __DEV__ && console.error(err);
			onQuery(values, { shouldReplace: true });
		});
	}

	handleReset = () => {
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
			state: { expand },
		} = this;

		return (
			<Form
				className={$$.container}
				onSubmit={this.handleSearch}
				layout="inline"
			>
				<Row gutter={40}>
					{children}
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
