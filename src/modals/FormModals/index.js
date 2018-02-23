import * as Issuers from 'constants/Issuers';
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
