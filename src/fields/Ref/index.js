import React, { Component } from 'react';
import field from 'hocs/field';
import RefSelector from 'components/RefSelector';

@field
export default class RefField extends Component {
	render() {
		return <RefSelector {...this.props} />;
	}
}
