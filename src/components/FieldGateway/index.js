import { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import withIssuer from 'hoc/withIssuer';
import RendererContext from './RendererContext';

@withIssuer()
@observer
export default class FieldGateway extends Component {
	static propTypes = {
		renderer: PropTypes.func.isRequired,
		issuers: PropTypes.instanceOf(Set).isRequired,
		props: PropTypes.object.isRequired,
		options: PropTypes.object.isRequired,
		children: PropTypes.func,
	};

	render() {
		const {
			props,
			props: { renderer, issuers, children, ...otherProps },
		} = this;
		const render = RendererContext.render(issuers, renderer, props);
		if (children) return children(render, otherProps);
		return render ? render(otherProps) : null;
	}
}
