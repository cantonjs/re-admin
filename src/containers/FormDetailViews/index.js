import * as Issuers from 'utils/Issuers';
import createFormDetailView from './createFormDetailView';

export const CreaterFormDetailView = createFormDetailView(
	'Create',
	Issuers.CREATER,
	'CreaterFormDetailView'
);
export const UpdaterFormDetailView = createFormDetailView(
	'Update',
	Issuers.UPDATER,
	'UpdaterFormDetailView'
);
