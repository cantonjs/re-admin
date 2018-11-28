import { observable, computed, action } from 'mobx';

export default class ModalControllerStore {
	@observable state = {};
	@observable name = '';

	@computed
	get visible() {
		return !!this.name;
	}

	constructor(parent) {
		this.parent = parent;
	}

	@action
	open(name, state) {
		this.name = name;
		this.state = state;
	}

	@action
	close() {
		this.name = '';
		this.state = {};
	}
}
