
import sidebarConfig from 'config/sidebar';
import DataTable from 'containers/DataTable';
import NotFound from 'containers/NotFound';
import jsxToPlainObject from 'utils/jsxToPlainObject';
import { memoize } from 'lodash';

const merge = (children) => children.map((child, index) => {
	if (child.children) { merge(child.children); }
	else if (!child.component) {
		child.component = child.table ? DataTable : NotFound;
	}
	child.key = index;
	return child;
});

export default memoize(function getSidebar() {
	return merge(jsxToPlainObject(sidebarConfig));
});
