import routerStore from 'stores/routerStore';
import { omit } from 'utils/fp';

export default function clearSortedInfo(appConfig) {
	const { sortKey, orderKey } = appConfig.api;
	const { location } = routerStore;
	location.query = omit(location.query, [sortKey, orderKey]);
}
