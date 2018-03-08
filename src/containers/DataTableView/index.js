import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import panelsStore from 'stores/panelsStore';
import connect from 'hoc/connect';
import PageContainer from 'components/PageContainer';
import TableBody from 'components/TableBody';
import TableQuery from 'components/TableQuery';
import DefaultToolbar from 'components/DefaultToolbar';
import ModalProvider from 'components/ModalProvider';

function DataTableView({
	table,
	title: menuTitle,
	pageTitle,
	header: Header,
	footer: Footer,
	toolbar: Toolbar,
	store,
}) {
	const title = pageTitle || menuTitle || table;

	return (
		<PageContainer title={title}>
			{Header && <Header store={store} title={title} />}
			{panelsStore.isShowQuery && <TableQuery store={store} />}
			<Toolbar />
			<TableBody store={store} />
			{Footer && <Footer store={store} />}
			<ModalProvider />
		</PageContainer>
	);
}

DataTableView.propTypes = {
	table: PropTypes.string.isRequired,
	title: PropTypes.string,
	pageTitle: PropTypes.string,
	header: PropTypes.func,
	footer: PropTypes.func,
	toolbar: PropTypes.func,
	store: PropTypes.object,
};

DataTableView.defaultProps = {
	toolbar: DefaultToolbar,
};

const connectHoc = connect({ bindLocation: true });
export default connectHoc(observer(DataTableView));
