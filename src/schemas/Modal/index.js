import React from 'react';
import PropTypes from 'utils/PropTypes';

export default function ModalSchema() {
	return <noscript />;
}

ModalSchema.propTypes = {
	name: PropTypes.string.isRequired,
	component: PropTypes.component.isRequired,
};

ModalSchema.schema = {
	name: 'modales',
	initialData: new Map(),
	pipe: ({ name, component }, modals) => {
		modals.set(name, component);
		return modals;
	},
};
