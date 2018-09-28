import styles from './styles';
import React from 'react';
import PropTypes from 'utils/PropTypes';
import { Spin } from 'antd';

const SpinBox = function SpinBox({ style, component: Comp, ...other }) {
	return (
		<Comp style={{ ...styles.container, ...style }}>
			<Spin {...other} />
		</Comp>
	);
};

SpinBox.propTypes = {
	style: PropTypes.object,
	component: PropTypes.component,
};

SpinBox.defaultProps = {
	component: 'div',
};

export default SpinBox;
