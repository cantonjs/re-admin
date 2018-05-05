import { Component } from 'react';
import PropTypes from 'prop-types';
import withIssuer from 'hoc/withIssuer';
import RendererContext from './RendererContext';

@withIssuer()
export default class FieldBaseWrapper extends Component {
	static propTypes = {
		renderer: PropTypes.func.isRequired,
		issuers: PropTypes.instanceOf(Set).isRequired,
		children: PropTypes.func,
	};

	_rendererContext = new RendererContext();

	render() {
		const { renderer, issuers, children } = this.props;
		renderer(this._rendererContext);
		const render = this._rendererContext.__getRender(issuers);
		if (children) return children(render);
		return render ? render() : null;
	}
}
