import React from 'react';
import localize from 'hoc/localize';

const ActionLabel = function ActionLabel(props) {
	return <span {...props} />;
};

export default localize({
	defaultProps: { children: 'label' },
	component: 'ActionsField',
})(ActionLabel);
