import { computed, observable, action } from 'mobx';

export default class ModalStore {
	@observable state = {};
	@observable name = '';
	@observable modalProps = {};

	@computed
	get visible() {
		return !!this.name;
	}

	constructor(parent) {
		this.parent = parent;
	}

	@action
	close() {
		this.name = '';
		this.state = {};
	}

	@action
	open(name, state) {
		this.name = name;
		this.state = state;
	}

	@action
	setModalProps(props) {
		this.modalProps = props;
	}
}
