import PropTypes from 'utils/PropTypes';
import React, { Component } from 'react';
import dataStoreProvider from 'hoc/dataStoreProvider';
import { Modal } from 'antd';
import TableBody from 'components/TableBody';
import TableQuery from 'components/TableQuery';

@dataStoreProvider()
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
		store: PropTypes.object,
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
		const { props: { fetch, store: refStore }, props } = this;
		refStore.call(fetch, props);
	}

	componentWillReceiveProps({ visible, fetch }) {
		if (this.props.visible !== visible && visible) {
			this.props.store.call(fetch);
		}
	}

	_handleCancel = () => {
		this.props.onRequestHide();
	};

	_handleOk = () => {
		const { onChange, onRequestHide, store } = this.props;
		onChange(store.selectedKeys[0], store);
		onRequestHide();
	};

	render() {
		const {
			props: {
				store,
				visible,
				label,
				modalWidth,
				modalStyle,
				modalTitle,
				noModalQuery,
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
				{!noModalQuery && <TableQuery store={store} />}
				<TableBody store={store} selectionType="radio" />
			</Modal>
		);
	}
}
