
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import panelsStore from 'stores/panelsStore';
import routerStore from 'stores/routerStore';
import { omit, isEqual } from 'lodash';
import { parse } from 'utils/qs';

import Title from 'react-title-component';
import TableBody from 'components/TableBody';
import TableQuery from 'components/TableQuery';
import DefaultToolbar from 'components/DefaultToolbar';
import ActionModal from 'components/ActionModal';

@observer
export default class DataTableView extends Component {
	static propTypes = {
		location: PropTypes.shape({
			query: PropTypes.object,
			pathname: PropTypes.string,
			search: PropTypes.string,
		}),
		table: PropTypes.string.isRequired,
		title: PropTypes.node,
		pageTitle: PropTypes.node,
		header: PropTypes.func,
		footer: PropTypes.func,
		toolbar: PropTypes.func,
	};

	static defaultProps = {
		toolbar: DefaultToolbar,
	};

	static childContextTypes = {
		store: PropTypes.object,
		queryNodes: PropTypes.node,
	};

	static contextTypes = {
		appConfig: PropTypes.object,
		DataStore: PropTypes.func.isRequired,
	};

	getChildContext() {
		return {
			store: this.state.store,
			queryNodes: this.state.queryNodes,
		};
	}

	componentWillMount() {
		const { table } = this.props;
		const { DataStore } = this.context;
		this.state = {
			...this._getDataNodes(table),
			store: DataStore.get(table),
		};
	}

	componentWillReceiveProps({ table }) {
		const { DataStore } = this.context;
		if (this.props.table !== table) {
			this.setState({
				...this._getDataNodes(table),
				store: DataStore.get(table),
			});
		}
	}

	componentDidMount() {
		this._fetch();
	}

	componentDidUpdate({ location: prevLocation }) {
		const { pathname, search } = this.props.location;

		if (location === prevLocation) { return; }

		if (prevLocation.pathname !== pathname) {
			this._fetch();
		}
		else if (prevLocation.search !== search) {
			const blackList = ActionModal.omitPaths;
			const prevQuery = omit(parse(prevLocation.search), blackList);
			const nextQuery = omit(routerStore.location.query, blackList);
			if (!isEqual(prevQuery, nextQuery)) {
				this._fetch();
			}
		}
	}

	_fetch() {
		const { query, search } = routerStore.location;
		this.state.store.fetch(query, search);
	}

	_getDataNodes(table) {
		const { appConfig } = this.context;
		const { formRenderers, queryRenderers } = appConfig.tables[table];

		return {
			formNodes: formRenderers.map(({ renderNode }) => renderNode()),
			queryNodes: queryRenderers.map(({ renderNode }) => renderNode()),
		};
	}

	render() {
		const {
			props: {
				table,
				title,
				pageTitle,
				header: Header,
				footer: Footer,
				toolbar: Toolbar,
			},
			state: {
				store,
				formNodes,
				queryNodes,
			},
		} = this;

		const heading = pageTitle || title || table;

		return (
			<div>
				<Title render={(parentTitle) => `${heading} | ${parentTitle}`} />

				<h1>{heading}</h1>

				{Header && <Header store={store} />}

				{panelsStore.isShowQuery &&
					<TableQuery>{queryNodes}</TableQuery>
				}

				<Toolbar />

				<TableBody store={store} />

				{Footer && <Footer store={store} />}

				<ActionModal store={store}>{formNodes}</ActionModal>
			</div>
		);
	}
}
