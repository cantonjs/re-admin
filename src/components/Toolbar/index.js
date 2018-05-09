import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'antd';
import { TOOLBAR } from 'utils/Issuers';
import withIssuer from 'hocs/withIssuer';

const { Group } = Button;

const styles = {
	container: {
		marginBottom: 24,
	},
	right: {
		textAlign: 'right',
	},
};

@withIssuer({ issuer: TOOLBAR })
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
						<Group>{left}</Group>
					</Col>
					<Col span={12} style={styles.right}>
						{right}
					</Col>
				</Row>
			</div>
		);
	}
}
