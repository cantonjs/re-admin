
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react';
import { noop } from 'empty-functions';
import createComponent from 'components/Nested/createComponent';
import { Button, Modal } from 'antd';
import TableBody from 'components/TableBody';
import TableQuery from 'components/TableQuery';

const styles = {
	modal: {
		minWidth: '72%',
	},
};

class State {
	@observable visible = false;
}

class LocStore {
	@observable _query = { page: 1 };

	@computed get query() {
		return this._query;
	}

	set query(query) {
		this._query = query;
		this._dataStore.fetch(query, Math.random());
		return query;
	}

	constructor(dataStore) {
		this._dataStore = dataStore;
	}
}

class HiddenRouterStore {
	location = new LocStore();

	constructor(dataStore) {
		this.location = new LocStore(dataStore);
	}
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
		} = this;

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
