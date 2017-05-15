
import $$ from './style.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'antd';
import ButtonRemove from 'components/ButtonRemove';
import ButtonUpdate from 'components/ButtonUpdate';
import ButtonCreate from 'components/ButtonCreate';
import QuerySwitch from 'components/QuerySwitch';

const { Group } = Button;

export default class Toolbar extends Component {
	static propTypes = {
		hasQueryFields: PropTypes.bool,
	};

	render() {
		const { hasQueryFields } = this.props;
		return (
			<div className={$$.container}>
				<Row justify="space-around">
					<Col span={12}>
						<Group>
							<ButtonCreate />
							<ButtonUpdate />
							<ButtonRemove />
						</Group>
					</Col>
					<Col span={12} className={$$.right}>
						{hasQueryFields &&
							<QuerySwitch />
						}
					</Col>
				</Row>
			</div>
		);
	}
}
