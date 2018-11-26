import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import panelsStore from 'stores/panelsStore';
import withTable from 'hocs/withTable';
import TableBody from 'components/TableBody';
import TableQuery from 'components/TableQuery';
import DefaultToolbar from 'components/DefaultToolbar';
import { ModalProvider } from 'components/Modal';

@withTable({ syncLocation: true, useCache: true })
@observer
export default class DataTableView extends Component {
	static propTypes = {
		table: PropTypes.string.isRequired,
		title: PropTypes.string,
		pageTitle: PropTypes.string,
		header: PropTypes.func,
		footer: PropTypes.func,
		toolbar: PropTypes.func,
		store: PropTypes.object,
	};

	static defaultProps = {
		toolbar: DefaultToolbar,
	};

	constructor(props) {
		super(props);
		props.store.clearCollections();
	}

	render() {
		const {
			table,
			title: menuTitle,
			pageTitle,
			header: Header,
			footer: Footer,
			toolbar: Toolbar,
			store,
		} = this.props;
		const title = pageTitle || menuTitle || table;
		return (
			<ModalProvider>
				{Header && <Header store={store} title={title} />}
				<TableQuery store={store} hidden={!panelsStore.isShowQuery} />
				<Toolbar />
				<TableBody store={store} />
				{Footer && <Footer store={store} />}
			</ModalProvider>
		);
	}
}
