import React from 'react';
import PropTypes from 'prop-types';
import panelsStore from 'stores/panelsStore';

import dataStoreProvider from 'hoc/dataStoreProvider';
import DocumentTitle from 'react-document-title';
import TableBody from 'components/TableBody';
import TableQuery from 'components/TableQuery';
import DefaultToolbar from 'components/DefaultToolbar';
import ActionModal from 'components/ActionModal';

function DataTableView(
	{
		table,
		title,
		pageTitle,
		header: Header,
		footer: Footer,
		toolbar: Toolbar,
		store,
		routerStore: { location },
	},
	{ appConfig }
) {
	const heading = pageTitle || title || table;

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

DataTableView.propTypes = {
	routerStore: PropTypes.shape({
		location: PropTypes.shape({
			query: PropTypes.object,
			pathname: PropTypes.string,
			search: PropTypes.string,
		}),
	}),
	table: PropTypes.string.isRequired,
	title: PropTypes.node,
	pageTitle: PropTypes.node,
	header: PropTypes.func,
	footer: PropTypes.func,
	toolbar: PropTypes.func,
	store: PropTypes.object,
};

DataTableView.defaultProps = {
	toolbar: DefaultToolbar,
};

DataTableView.contextTypes = {
	appConfig: PropTypes.object,
};

export default dataStoreProvider()(DataTableView);
