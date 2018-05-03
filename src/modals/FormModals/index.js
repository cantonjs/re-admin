import * as Issuers from 'utils/Issuers';
import createFormModal from './createFormModal';

export const CreaterModal = createFormModal(
	'Create',
	Issuers.CREATER,
	'CreaterModal'
);
export const UpdaterModal = createFormModal(
	'Update',
	Issuers.UPDATER,
	'UpdaterModal'
);
