import React from 'react';
import localize from 'hocs/localize';
import PropTypes from 'prop-types';

const ActionLabel = function ActionLabel({ localeStore, ...props }) {
	return <span {...props} />;
};

ActionLabel.displayName = 'ActionLabel';

ActionLabel.propTypes = {
	localeStore: PropTypes.object.isRequired,
};

export default localize('ActionsField', {
	defaultProps: { children: 'label' },
})(ActionLabel);
