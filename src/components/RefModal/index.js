
import PropTypes from 'utils/PropTypes';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import HiddenRouterStore from './HiddenRouterStore';
import { Modal } from 'antd';
import TableBody from 'components/TableBody';
import TableQuery from 'components/TableQuery';

@observer
export default class RefModal extends Component {
	static propTypes = {
		visible: PropTypes.bool,
		onRequestHide: PropTypes.func.isRequired,
		onChange: PropTypes.func,
		table: PropTypes.string.isRequired,
		label: PropTypes.node,
		modalStyle: PropTypes.object,
		modalWidth: PropTypes.stringOrNumber,
		modalTitle: PropTypes.node,
		noModalQuery: PropTypes.bool,
		fetch: PropTypes.string,
	};

	static defaultProps = {
		visible: false,
		modalWidth: '70%',
		placeholder: '',
		noModalQuery: false,
		fetch: 'fetch',
	};

	static contextTypes = {
		DataStore: PropTypes.func.isRequired,
	};

	componentWillMount() {
		const { props: { table, fetch }, context: { DataStore } } = this;
		this._store = new DataStore(table);
		this._hiddenRouterStore = new HiddenRouterStore(this._store, { fetch });
	}

	componentWillReceiveProps({ visible, fetch }) {
		if (this.props.visible !== visible && visible) {
			this._store.call(fetch);
		}
	}

	_handleCancel = () => {
		this.props.onRequestHide();
	};

	_handleOk = () => {
		const { onChange, onRequestHide } = this.props;
		onChange(this._store.selectedKeys[0], this._hiddenRouterStore);
		onRequestHide();
	};

	render() {
		const {
			_hiddenRouterStore,
			_store,
			props: {
				visible, label,
				modalWidth, modalStyle, modalTitle, noModalQuery,
			},
		} = this;

		return (
			<Modal
				title={modalTitle || label || '引用'}
				style={{ ...modalStyle, minWidth: modalWidth }}
				maskClosable={false}
				visible={visible}
				onCancel={this._handleCancel}
				onOk={this._handleOk}
			>
				{!noModalQuery &&
					<TableQuery
						store={_store}
						routerStore={_hiddenRouterStore}
					/>
				}
				<TableBody
					store={_store}
					routerStore={_hiddenRouterStore}
					selectionType="radio"
				/>
			</Modal>
		);
	}
}
