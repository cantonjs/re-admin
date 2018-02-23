import React from 'react';
import PropTypes from 'prop-types';
import panelsStore from 'stores/panelsStore';

import dataStoreProvider from 'hoc/dataStoreProvider';
import DocumentTitle from 'react-document-title';
import TableBody from 'components/TableBody';
import TableQuery from 'components/TableQuery';
import DefaultToolbar from 'components/DefaultToolbar';
// import ActionModal from 'components/ActionModal';
import ModalProvider from 'components/ModalProvider';

function DataTableView(
	{
		table,
		title,
		pageTitle,
		header: Header,
		footer: Footer,
		toolbar: Toolbar,
		store,
	},
	{ appConfig }
) {
	const heading = pageTitle || title || table;

	return (
		<DocumentTitle title={`${heading} | ${appConfig.title}`}>
			<div>
				<h1>{heading}</h1>
				{Header && <Header store={store} />}
				{panelsStore.isShowQuery && <TableQuery store={store} />}
				<Toolbar />
				<TableBody store={store} />
				{Footer && <Footer store={store} />}
				{/*<ActionModal />*/}
				<ModalProvider />
			</div>
		</DocumentTitle>
	);
}

DataTableView.propTypes = {
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

export default dataStoreProvider({ bindLocation: true })(DataTableView);
