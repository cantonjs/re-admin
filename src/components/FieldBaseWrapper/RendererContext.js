import * as Issuers from 'utils/Issuers';

export default class RendererContext {
	constructor() {
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

	__getRender(issuers) {
		for (const { getCondition, render } of this._flows) {
			if (getCondition(issuers)) {
				return render;
			}
		}
	}
}
