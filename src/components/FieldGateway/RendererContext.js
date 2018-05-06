import * as Issuers from 'utils/Issuers';

export default class RendererContext {
	static render(issuers, renderer, props) {
		const context = new RendererContext(props);
		context.__issuers = issuers;
		context.__render = null;
		renderer(context);
		if (context.__render) {
			const render = context.__render;
			context.__render = null;
			return render;
		}
	}

	constructor({ props, options }) {
		this.props = props;
		this.options = options;
		Object.assign(this, Issuers);
		this.is = (issuer) => this.__issuers.has(issuer);
		Object.keys(Issuers).forEach((key) => {
			Object.defineProperty(this.is, key, {
				// eslint-disable-next-line import/namespace
				get: () => this.is(Issuers[key]),
			});
		});
	}

	when(condition, render) {
		if (this.__render) return this;
		if (condition) this.__render = render;
		return this;
	}
}
