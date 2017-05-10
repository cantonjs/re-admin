
import sidebarConfig from 'config/sidebar';
import Table from 'containers/Table';
import NotFound from 'containers/NotFound';
import jsxToPlainObject from 'utils/jsxToPlainObject';
import { memoize } from 'lodash';

const merge = (children) => children.map((child, index) => {
	if (child.children) { merge(child.children); }
	else if (!child.component) {
		child.component = child.table ? Table : NotFound;
	}
	child.key = index;
	return child;
});

export default memoize(function getSidebar() {
	return merge(jsxToPlainObject(sidebarConfig));
});
