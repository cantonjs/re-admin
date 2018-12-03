import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import { observer } from 'mobx-react';
import panelsStore from 'stores/panelsStore';
import withTable from 'hocs/withTable';
import TableBody from 'components/TableBody';
import TableQuery from 'components/TableQuery';
import Toolbar from 'components/Toolbar';
import { ModalProvider } from 'components/Modal';

@withTable({ syncLocation: true, useCache: true })
@observer
export default class DataTableView extends Component {
	static propTypes = {
		table: PropTypes.string.isRequired,
		title: PropTypes.string,
		pageTitle: PropTypes.string,
		header: PropTypes.component,
		footer: PropTypes.component,
		toolbar: PropTypes.component,
		store: PropTypes.object,
	};

	static defaultProps = {
		toolbar: Toolbar,
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
			<div>
				{Header && <Header store={store} title={title} />}
				<TableQuery store={store} hidden={!panelsStore.isShowQuery} />
				{Toolbar && <Toolbar store={store} />}
				<TableBody store={store} />
				{Footer && <Footer store={store} />}
			</div>
		);
	}
}
