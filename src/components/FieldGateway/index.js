import { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import withIssuer from 'hocs/withIssuer';
import RendererContext from './RendererContext';

@withIssuer()
@observer
export default class FieldGateway extends Component {
	static propTypes = {
		renderer: PropTypes.func.isRequired,
		issuers: PropTypes.instanceOf(Set).isRequired,
		props: PropTypes.object.isRequired,
		state: PropTypes.object.isRequired,
		children: PropTypes.func,
	};

	render() {
		const {
			renderer,
			issuers,
			children,
			props,
			state,
			...otherProps
		} = this.props;
		const render = RendererContext.render(issuers, renderer, props, state);
		if (children) return children(render, otherProps);
		return render ? render(otherProps) : null;
	}
}
