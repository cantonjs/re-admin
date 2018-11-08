import React, { PureComponent, cloneElement } from 'react';
import PropTypes from 'prop-types';
import invariant from 'tiny-invariant';
import naviStore from 'stores/naviStore';
import PageContext from 'contexts/PageContext';
import AppConfigContext from 'contexts/AppConfig';
import DocumentTitle from 'react-document-title';

export default class NaviEnhancer extends PureComponent {
	static propTypes = {
		children: PropTypes.node.isRequired,
		title: PropTypes.string,
		pageTitle: PropTypes.string,
		table: PropTypes.string,
	};

	constructor(props) {
		super(props);
		const { children, ...other } = props;
		naviStore.setState(other);
	}

	_renderInAppConfigContext = (appConfig) => {
		invariant(
			appConfig,
			'You should not use <EnhancedRoute> outside <AppContext>'
		);

		const { props, props: { children, ...other } } = this;
		const { title: appTitle } = appConfig;
		const pageTitle = props.pageTitle || props.title || props.table;
		const title = pageTitle ? `${pageTitle} | ${appTitle}` : appTitle;

		return (
			<DocumentTitle title={title}>
				<PageContext.Provider value={props}>
					{cloneElement(children, other)}
				</PageContext.Provider>
			</DocumentTitle>
		);
	};

	render() {
		return (
			<AppConfigContext.Consumer>
				{this._renderInAppConfigContext}
			</AppConfigContext.Consumer>
		);
	}
}
