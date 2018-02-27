import { computed } from 'mobx';
import localeStore from 'stores/localeStore';

export default class LocalProp {
	@computed
	get value() {
		return localeStore[this.name][this.key];
	}

	constructor(name, key) {
		this.name = name;
		this.key = key;
	}
}
