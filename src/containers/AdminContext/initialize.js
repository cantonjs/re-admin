import * as Actions from 'constants/Actions';
import { UpdaterModal, CreaterModal } from 'modals/FormModals';
import RefModal from 'modals/RefModal';

export function initModals(modals) {
	modals.set(Actions.CREATE, CreaterModal);
	modals.set(Actions.UPDATE, UpdaterModal);
	modals.set(Actions.REF, RefModal);
}
