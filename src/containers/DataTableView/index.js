
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import panelsStore from 'stores/panelsStore';
import routerStore from 'stores/routerStore';
import { omitBy, isEqual } from 'lodash';
import { parse } from 'tiny-querystring';

import DocumentTitle from 'react-document-title';
import TableBody from 'components/TableBody';
import TableQuery from 'components/TableQuery';
import DefaultToolbar from 'components/DefaultToolbar';
import NavigatorModal from 'components/NavigatorModal';

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
	};

	static contextTypes = {
		appConfig: PropTypes.object,
		DataStore: PropTypes.func.isRequired,
	};

	getChildContext() {
		return {
			store: this.state.store,
		};
	}

	componentWillMount() {
		const { table } = this.props;
		const { DataStore } = this.context;
		this.state = {
			store: DataStore.get(table),
		};
	}

	componentWillReceiveProps({ table }) {
		const { DataStore } = this.context;
		if (this.props.table !== table) {
			this.setState({
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
			const getBlackList = NavigatorModal.makeGetOmitPaths();
			const originalPrevQuery = parse(prevLocation.search.slice(1));
			const prevQuery = omitBy(originalPrevQuery, getBlackList);
			const nextQuery = omitBy(routerStore.location.query, getBlackList);
			if (!isEqual(prevQuery, nextQuery)) {
				this._fetch();
			}
		}
	}

	_fetch() {
		const { query, search } = routerStore.location;
		this.state.store.fetch(query, search);
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
			state: { store },
			context: {
				appConfig,
			},
		} = this;

		const heading = pageTitle || title || table;

		return (
			<DocumentTitle title={`${heading} | ${appConfig.title}`}>
				<div>
					<h1>{heading}</h1>
					{Header && <Header store={store} />}
					{panelsStore.isShowQuery &&
						<TableQuery store={store} />
					}
					<Toolbar />
					<TableBody store={store} />
					{Footer && <Footer store={store} />}
					<NavigatorModal />
				</div>
			</DocumentTitle>
		);
	}
}
