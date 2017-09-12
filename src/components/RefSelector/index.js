
import PropTypes from 'utils/PropTypes';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { noop } from 'empty-functions';
import { State, HiddenRouterStore } from './Stores';
import createComponent from 'components/Nested/createComponent';
import { Button, Modal } from 'antd';
import TableBody from 'components/TableBody';
import TableQuery from 'components/TableQuery';

const styles = {
	button: {
		width: '100%',
		textAlign: 'left',
		padding: '0 7px',
	},
};

@observer
class RefSelector extends Component {
	static propTypes = {
		table: PropTypes.string.isRequired,
		onChange: PropTypes.func,
		value: PropTypes.any,
		style: PropTypes.object,
		modalStyle: PropTypes.object,
		modalWidth: PropTypes.stringOrNumber,
	};

	static defaultProps = {
		onChange: noop,
		modalWidth: '70%',
	};

	static contextTypes = {
		DataStore: PropTypes.func.isRequired,
		appConfig: PropTypes.object.isRequired,
	};

	componentWillMount() {
		const { table } = this.props;
		const { appConfig } = this.context;
		const { queryRenderers } = appConfig.tables[table];
		this._state = new State();
		this._queryNodes = queryRenderers.map(({ renderNode }) => renderNode());
		this._store = new this.context.DataStore(table);
		this._hiddenRouterStore = new HiddenRouterStore(this._store);
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
		onChange(this._store.selectedKeys[0]);
	};

	render() {
		const {
			_state: { visible },
			_hiddenRouterStore,
			_store,
			_queryNodes,
			props: { value, style, modalWidth, modalStyle },
		} = this;

		return (
			<div>
				<Button
					style={{ ...styles.button, ...style }}
					size="large"
					onClick={this._handleClick}
				>
					{value}
				</Button>
				<Modal
					title="Ref"
					style={{ ...modalStyle, minWidth: modalWidth }}
					maskClosable={false}
					key="ref"
					visible={visible}
					onCancel={this._handleCancel}
					onOk={this._handleOk}
				>
					<TableQuery
						store={_store}
						routerStore={_hiddenRouterStore}
					>
						{_queryNodes}
					</TableQuery>
					<TableBody
						store={_store}
						routerStore={_hiddenRouterStore}
						noMulti
					/>
				</Modal>
			</div>
		);
	}
}

export default createComponent(RefSelector, {
	displayName: 'NestInput',
	onChange(val) { return val; }
});
