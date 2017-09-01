
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'antd';

const { Group } = Button;

const styles = {
	container: {
		margin: '24px 0',
	},
	right: {
		textAlign: 'right',
	},
};

export default class Toolbar extends Component {
	static propTypes = {
		left: PropTypes.node,
		right: PropTypes.node,
	};

	render() {
		const { left, right } = this.props;
		return (
			<div style={styles.container}>
				<Row justify="space-around">
					<Col span={12}>
						<Group>
							{left}
						</Group>
					</Col>
					<Col span={12} style={styles.right}>
						{right}
					</Col>
				</Row>
			</div>
		);
	}
}
