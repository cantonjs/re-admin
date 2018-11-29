import styles from './styles';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TOOLBAR } from 'utils/Issuers';
import withIssuer from 'hocs/withIssuer';
import { Row, Col, Button } from 'antd';
import RemoveButton from 'components/RemoveButton';
import UpdateButton from 'components/UpdateButton';
import CreateButton from 'components/CreateButton';
import TableQuerySwitch from 'components/TableQuerySwitch';

const { Group } = Button;

@withIssuer({ issuer: TOOLBAR })
export default class Toolbar extends Component {
	static propTypes = {
		left: PropTypes.node,
		right: PropTypes.node,
		noCreateButton: PropTypes.bool,
		noUpdateButton: PropTypes.bool,
		noRemoveButton: PropTypes.bool,
		leftPrefix: PropTypes.node,
		leftSuffix: PropTypes.node,
		rightPrefix: PropTypes.node,
		rightSuffix: PropTypes.node,
	};

	static defaultProps = {
		noCreateButton: false,
		noUpdateButton: false,
		noRemoveButton: false,
	};

	render() {
		const {
			left,
			right,
			noCreateButton,
			noUpdateButton,
			noRemoveButton,
			leftPrefix,
			leftSuffix,
			rightPrefix,
			rightSuffix,
		} = this.props;
		return (
			<div style={styles.container}>
				<Row justify="space-around">
					<Col span={12}>
						<Group>
							{leftPrefix}
							{left}
							{!left && !noCreateButton && <CreateButton />}
							{!left && !noUpdateButton && <UpdateButton />}
							{!left && !noRemoveButton && <RemoveButton />}
							{leftSuffix}
						</Group>
					</Col>
					<Col span={12} style={styles.right}>
						<Group>
							{rightPrefix}
							{right || <TableQuerySwitch />}
							{rightSuffix}
						</Group>
					</Col>
				</Row>
			</div>
		);
	}
}
