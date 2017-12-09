
import * as Issuers from 'constants/Issuers';
import createFormModal from './createFormModal';

export const CreaterModal = createFormModal(Issuers.CREATER, 'CreaterModal');
export const UpdaterModal = createFormModal(Issuers.UPDATER, 'UpdaterModal');
