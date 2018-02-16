import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import panelsStore from 'stores/panelsStore';
import routerStore from 'stores/routerStore';
import ActionModalStore from 'stores/ActionModalStore';
import { omitBy, isEqual } from 'lodash';

import DocumentTitle from 'react-document-title';
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

	constructor(props, context) {
		super(props, context);
		const { table } = props;
		const { DataStore } = context;
		this.state = {
			store: DataStore.get(table),
		};
	}

	componentWillMount() {
		const { history } = routerStore;
		this._unlisten = history.listen((location, prevLocation) => {
			if (location.pathname === prevLocation.pathname) {
				const { getOmitPaths } = ActionModalStore;
				const prevQuery = omitBy(prevLocation.query, getOmitPaths);
				const nextQuery = omitBy(location.query, getOmitPaths);
				if (!isEqual(prevQuery, nextQuery)) {
					this._fetch();
				}
			}
		});
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

	componentWillUnmount() {
		this._unlisten();
	}

	_fetch() {
		const { query, search } = routerStore.location;
		this.state.store.fetch({ query, state: { cacheKey: search } });
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
			context: { appConfig },
		} = this;

		const heading = pageTitle || title || table;
		const { location } = routerStore;

		return (
			<DocumentTitle title={`${heading} | ${appConfig.title}`}>
				<div>
					<h1>{heading}</h1>
					{Header && <Header store={store} />}
					{panelsStore.isShowQuery && (
						<TableQuery store={store} location={location} />
					)}
					<Toolbar />
					<TableBody store={store} location={location} />
					{Footer && <Footer store={store} />}
					<ActionModal />
				</div>
			</DocumentTitle>
		);
	}
}
