import { Component } from 'react';
import PropTypes from 'prop-types';
import withIssuer from 'hoc/withIssuer';
import * as Issuers from 'utils/Issuers';

class RendererContext {
	constructor({ props, options }) {
		this.props = props;
		this.options = options;
		this._flows = [];
		Object.assign(this, Issuers);
	}

	is(issuer) {
		return function getCondition(issuers) {
			return issuers.has(issuer);
		};
	}

	when(getCondition, render) {
		this._flows.push({ getCondition, render });
		return this;
	}

	render(issuers) {
		for (const { getCondition, render } of this._flows) {
			if (getCondition(issuers)) return render(this.options) || null;
		}
		return null;
	}
}

@withIssuer()
export default class FieldBaseWrapper extends Component {
	static propTypes = {
		renderer: PropTypes.func.isRequired,
		props: PropTypes.object.isRequired,
		options: PropTypes.object.isRequired,
		issuers: PropTypes.instanceOf(Set).isRequired,
	};

	constructor(props) {
		super(props);
		this._rendererContext = new RendererContext(props);
	}

	render() {
		const { renderer, issuers } = this.props;
		renderer(this._rendererContext);
		return this._rendererContext.render(issuers);
	}
}
