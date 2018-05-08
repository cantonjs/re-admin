import { observable, computed } from 'mobx';

export default class FormStore {
	@computed
	get record() {
		return this.state;
	}

	@observable state = {};

	setState(state) {
		this.state = state;
	}
}
