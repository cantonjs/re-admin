import * as Issuers from 'utils/Issuers';
import createFormDetailView from './createFormDetailView';

export const CreaterFormDetailView = createFormDetailView(
	'create',
	Issuers.CREATER,
	'CreaterFormDetailView'
);
export const UpdaterFormDetailView = createFormDetailView(
	'update',
	Issuers.UPDATER,
	'UpdaterFormDetailView'
);
