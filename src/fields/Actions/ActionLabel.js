import React from 'react';
import localize from 'hocs/localize';

const ActionLabel = function ActionLabel(props) {
	return <span {...props} />;
};

ActionLabel.displayName = 'ActionLabel';

export default localize('ActionsField', {
	defaultProps: { children: 'label' },
})(ActionLabel);
