import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

function PageContainer(props, context) {
	const { title: pageTitle, ...other } = props;
	const { title: appTitle } = context.appConfig;
	const title = pageTitle ? `${pageTitle} | ${appTitle}` : appTitle;
	return (
		<DocumentTitle title={title}>
			<div {...other} />
		</DocumentTitle>
	);
}

PageContainer.propTypes = {
	title: PropTypes.string,
};

PageContainer.contextTypes = {
	appConfig: PropTypes.object,
};

export default PageContainer;
