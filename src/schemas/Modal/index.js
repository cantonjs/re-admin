import React from 'react';
import PropTypes from 'utils/PropTypes';
import * as Actions from 'constants/Actions';
import { UpdaterModal, CreaterModal } from 'modals/FormModals';
import RefModal from 'modals/RefModal';

export default function ModalSchema() {
	return <noscript />;
}

ModalSchema.propTypes = {
	name: PropTypes.string.isRequired,
	component: PropTypes.component.isRequired,
};

ModalSchema.configuration = {
	name: 'modals',
	pipe: ({ name, component }, modals) => {
		modals.set(name, component);
		return modals;
	},
	initialData() {
		const modals = new Map();
		modals.set(Actions.CREATE, CreaterModal);
		modals.set(Actions.UPDATE, UpdaterModal);
		modals.set(Actions.REF, RefModal);
		return modals;
	},
};
