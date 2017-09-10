
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { noop } from 'empty-functions';
import createComponent from 'components/Nested/createComponent';
import { Button, Modal } from 'antd';
import TableBody from 'components/TableBody';

const styles = {
	modal: {
		minWidth: '72%',
	},
};

class State {
	@observable visible = false;
}

@observer
class RefSelector extends Component {
	static propTypes = {
		table: PropTypes.string.isRequired,
		onChange: PropTypes.func,
	};

	static defaultProps = {
		onChange: noop,
	};

	static contextTypes = {
		DataStore: PropTypes.func.isRequired,
	};

	componentWillMount() {
		const { table } = this.props;
		this._state = new State();
		this._store = this.context.DataStore.get(table);
	}

	_handleClick = () => {
		this._store.fetch({}, 'fork');
		this._state.visible = true;
	};

	_handleCancel = () => {
		this._state.visible = false;
	};

	_handleOk = () => {
		const { onChange } = this.props;
		this._state.visible = false;
		onChange('shit');
	};

	render() {
		const { visible } = this._state;
		return (
			<div>
				<Button onClick={this._handleClick}>Ref</Button>
				<Modal
					title="Ref"
					style={styles.modal}
					maskClosable={false}
					key="ref"
					visible={visible}
					onCancel={this._handleCancel}
					onOk={this._handleOk}
				>
					<TableBody store={this._store} />
				</Modal>
			</div>
		);
	}
}

export default createComponent(RefSelector, {
	displayName: 'NestInput',
	onChange(val) { return val; }
});
