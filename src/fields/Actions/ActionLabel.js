import React from 'react';
import localize from 'hocs/localize';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

const ActionLabel = function ActionLabel({ localeStore }) {
	return <span>{localeStore.data.label}</span>;
};

ActionLabel.displayName = 'ActionLabel';

ActionLabel.propTypes = {
	localeStore: PropTypes.object.isRequired,
};

export default localize('ActionsField')(observer(ActionLabel));
